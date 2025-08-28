// src/main/java/basilium/basiliumserver/domain/user/service/UserStateService.java
package basilium.basiliumserver.domain.user.service;

import basilium.basiliumserver.domain.user.entity.*;
import basilium.basiliumserver.domain.user.repository.BrandUserRepository;
import basilium.basiliumserver.domain.user.repository.NormalUserRepository;
import basilium.basiliumserver.domain.user.repository.SuperUserRepository;
import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import basilium.basiliumserver.global.image.FileStorageService;
import basilium.basiliumserver.properties.ImageProperties;
import basilium.basiliumserver.domain.user.dto.LoginResponse;
import basilium.basiliumserver.domain.user.dto.RefreshTokenResponse;
import basilium.basiliumserver.global.auth.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class UserStateService {

    private final NormalUserRepository normalUserRepository;
    private final BrandUserRepository brandUserRepository;
    private final SuperUserRepository superUserRepository;
    private final ImageProperties imageProperties;
    private final JwtUtil jwtUtil;
    private final FileStorageService storage;
    private final PasswordEncoder passwordEncoder;

    /* ------------ Auth ------------ */

    private LoginResponse generateTokens(String userId, String userType) {
        String accessToken = jwtUtil.createJwt(userId, userType);
        String refreshToken = jwtUtil.createRefreshToken(userId);
        return new LoginResponse(userType, accessToken, refreshToken);
    }

    public LoginResponse login(String userId, String userPassword) {
        Optional<NormalUser> normal = normalUserRepository.findById(userId);
        if (normal.isPresent() && passwordEncoder.matches(userPassword, normal.get().getPassword())) {
            return generateTokens(userId, Provider.NORMAL.name());
        }
        Optional<BrandUser> brand = brandUserRepository.findById(userId);
        if (brand.isPresent() && passwordEncoder.matches(userPassword, brand.get().getPassword())) {
            return generateTokens(userId, Provider.BRAND.name());
        }
        Optional<SuperUser> sup = superUserRepository.findById(userId);
        if (sup.isPresent() && passwordEncoder.matches(userPassword, sup.get().getPassword())) {
            return generateTokens(userId, Provider.SUPER.name());
        }
        return new LoginResponse();
    }

    public RefreshTokenResponse refreshAccessToken(String refreshToken) {
        if (jwtUtil.isTokenBlacklisted(refreshToken)) {
            throw new BasiliumCustomException(ErrorCode.UNAUTHENTICATED, "블랙리스트 토큰입니다.");
        }
        if (!jwtUtil.validateRefreshToken(refreshToken)) {
            throw new BasiliumCustomException(ErrorCode.UNAUTHENTICATED, "유효하지 않은 리프레시 토큰입니다.");
        }
        String userId = jwtUtil.getUserId(refreshToken);
        User user = findUserById(userId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.MEMBER_NOT_FOUND, "사용자를 찾을 수 없습니다."));
        String userType = resolveRole(user);
        String newAccessToken = jwtUtil.createJwt(userId, userType);
        return new RefreshTokenResponse(userId, newAccessToken);
    }

    public void logout(HttpServletRequest request) {
        String authz = request.getHeader("Authorization");
        if (authz != null && authz.startsWith("Bearer ")) {
            String token = authz.substring(7);
            jwtUtil.blacklistToken(token);
            log.info("로그아웃: 토큰 블랙리스트 등록 완료");
        }
    }

    /* ------------ Common ------------ */

    private Optional<User> findUserById(String userId) {
        return normalUserRepository.findById(userId).map(u -> (User) u)
                .or(() -> brandUserRepository.findById(userId).map(u -> (User) u))
                .or(() -> superUserRepository.findById(userId).map(u -> (User) u));
    }

    private String resolveRole(User u) {
        if (u instanceof NormalUser) return "normal";
        if (u instanceof BrandUser) return "brand";
        if (u instanceof SuperUser) return "super";
        throw new BasiliumCustomException(ErrorCode.SERVER_ERROR, "알 수 없는 사용자 타입");
    }

    /* ------------ 회원 탈퇴 (이미지 정리 포함) ------------ */

    public void deleteUser(String userId) {
        User user = findUserById(userId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.MEMBER_NOT_FOUND, "유저가 없습니다: " + userId));

        // 일반 이미지 삭제
        Optional.ofNullable(user.getUserImageUrl()).ifPresent(fn -> deletePhysical(imageProperties.getFullUploadDir(), fn));

        // 프로필 이미지 삭제
        Optional.ofNullable(user.getUserProfileImageUrl()).ifPresent(fn -> deletePhysical(imageProperties.getFullProfileDir(), fn));

        if (user instanceof NormalUser nu) {
            normalUserRepository.delete(nu);
        } else if (user instanceof BrandUser bu) {
            brandUserRepository.delete(bu);
        } else if (user instanceof SuperUser su) {
            superUserRepository.delete(su);
        }
        log.info("회원({}) 탈퇴 완료", userId);
    }

    private void deletePhysical(String fullDir, String fileName) {
        try {
            Path p = Paths.get(fullDir, fileName);
            Files.deleteIfExists(p);
        } catch (Exception e) {
            log.warn("파일 삭제 실패: {}/{}", fullDir, fileName, e);
        }
    }

    /* ------------ 일반 이미지 (userImageUrl) ------------ */

    public String uploadImage(String userId, MultipartFile file) {
        User user = findUserById(userId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.MEMBER_NOT_FOUND, "유저가 없습니다: " + userId));

        if (file.isEmpty() || file.getSize() <= 0) {
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "빈 파일 업로드는 허용되지 않습니다.");
        }
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "파일 크기는 10MB 이하입니다.");
        }

        String role = resolveRole(user);
        String fileName = storage.store(file, imageProperties.getFullUploadDir(), role, userId); // 파일명 반환
        user.setUserImageUrl(fileName); // DB에는 파일명만 저장

        String url = imageProperties.getDomainUploadDir() + fileName; // 클라이언트엔 URL
        return url;
    }

    /** 기존 저장된 일반 이미지 URL 조회 (URL 조립) */
    public String getUserImageUrl(String userId) {
        User user = findUserById(userId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.MEMBER_NOT_FOUND, "유저가 없습니다: " + userId));
        String fn = Optional.ofNullable(user.getUserImageUrl())
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "이미지 없음"));
        return imageProperties.getDomainUploadDir() + fn;
    }

    /** AI 서버로 파일 바이트 전송 */
    public byte[] getImageFileByUrl(String imageUrl) {
        String fileName = Paths.get(imageUrl).getFileName().toString();
        Path p = Paths.get(imageProperties.getFullUploadDir(), fileName);
        try {
            if (!Files.exists(p)) throw new FileNotFoundException("이미지 파일이 존재하지 않습니다.");
            return Files.readAllBytes(p);
        } catch (Exception e) {
            throw new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "이미지 읽기 실패: " + p);
        }
    }

    /* ------------ 프로필 이미지 (userProfileImageUrl) ------------ */

    public String uploadProfileImage(String userId, MultipartFile file) {
        User user = findUserById(userId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.MEMBER_NOT_FOUND, "유저가 없습니다: " + userId));

        if (file.isEmpty() || file.getSize() <= 0) {
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "빈 파일 업로드는 허용되지 않습니다.");
        }
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "파일 크기는 10MB 이하입니다.");
        }

        String role = resolveRole(user);
        String fileName = storage.store(file, imageProperties.getFullProfileDir(), role, userId);
        user.setUserProfileImageUrl(fileName);

        return imageProperties.getDomainProfileDir() + fileName;
    }

    /** 프로필 이미지를 바이너리로 반환 (정적 서빙을 쓰는 경우엔 URL만 제공해도 됨) */
    public MediaType resolveMediaType(String fileName) {
        String lower = fileName.toLowerCase();
        if (lower.endsWith(".png")) return MediaType.IMAGE_PNG;
        if (lower.endsWith(".jpeg")) return MediaType.IMAGE_JPEG;
        if (lower.endsWith(".gif")) return MediaType.IMAGE_GIF;
        return MediaType.IMAGE_JPEG;
    }

    public byte[] getProfileImage(String userId) {
        User user = findUserById(userId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.MEMBER_NOT_FOUND, "유저가 없습니다: " + userId));

        String fileName = Optional.ofNullable(user.getUserProfileImageUrl())
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "프로필 이미지가 없습니다."));

        Path p = Paths.get(imageProperties.getFullProfileDir(), fileName);
        try {
            if (!Files.exists(p)) throw new FileNotFoundException("이미지 파일이 존재하지 않습니다.");
            return Files.readAllBytes(p);
        } catch (Exception e) {
            throw new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "이미지 읽기 실패: " + p);
        }
    }
}
