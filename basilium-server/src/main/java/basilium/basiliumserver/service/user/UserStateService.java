package basilium.basiliumserver.service.user;

import basilium.basiliumserver.domain.user.*;
import basilium.basiliumserver.properties.ImageProperties;
import basilium.basiliumserver.repository.user.BrandUserRepository;
import basilium.basiliumserver.repository.user.NormalUserRepository;
import basilium.basiliumserver.repository.user.SuperUserRepository;
import basilium.basiliumserver.service.DTO.user.LoginResponse;
import basilium.basiliumserver.service.DTO.user.RefreshTokenResponse;
import basilium.basiliumserver.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.nio.file.Files;
import java.io.File;
import java.io.IOException;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

//user 통합 로그인 로그아웃 이미지 업로드
@Slf4j
@Transactional
@Service
public class UserStateService {
    private static final Logger logger = LoggerFactory.getLogger(UserStateService.class);


    private final NormalUserRepository normalUserRepository;
    private final BrandUserRepository brandUserRepository;
    private final SuperUserRepository superUserRepository;
    private final ImageProperties imageProperties;  // ImageProperties 빈 주입
    private final JwtUtil jwtUtil;

    @Autowired
    public UserStateService(NormalUserRepository normalUserRepository,
                            BrandUserRepository brandUserRepository,
                            SuperUserRepository superUserRepository,
                            ImageProperties imageProperties,
                            JwtUtil jwtUtil) {
        this.normalUserRepository = normalUserRepository;
        this.brandUserRepository = brandUserRepository;
        this.superUserRepository = superUserRepository;
        this.imageProperties = imageProperties;
        this.jwtUtil = jwtUtil;
    }


    public LoginResponse login(String userId, String userPassword) {
        Optional<NormalUser> normalUser = normalUserRepository.findById(userId);
        Optional<BrandUser> brandUser = brandUserRepository.findById(userId);
        Optional<SuperUser> superUser = superUserRepository.findById(userId);

        if (normalUser.isPresent() && normalUser.get().getPassword().equals(userPassword)) {
            return generateTokens(userId, "normal");
        } else if (brandUser.isPresent() && brandUser.get().getPassword().equals(userPassword)) {
            return generateTokens(userId, "brand");
        } else if (superUser.isPresent() && superUser.get().getPassword().equals(userPassword)) {
            return generateTokens(userId, "super");
        }

        return new LoginResponse();  // Return empty LoginResponse for failed login
    }



    private LoginResponse generateTokens(String userId, String userType) {
        String accessToken = jwtUtil.createJwt(userId, userType);
        String refreshToken = jwtUtil.createRefreshToken(userId);
        return new LoginResponse(userType, accessToken, refreshToken);
    }

    // 사용자 조회 메서드
    private Optional<User> findUserById(String userId) {
        Optional<User> user = normalUserRepository.findById(userId)
                .map(u -> (User) u);
        if (user.isPresent()) return user;

        user = brandUserRepository.findById(userId)
                .map(u -> (User) u);
        if (user.isPresent()) return user;

        return superUserRepository.findById(userId)
                .map(u -> (User) u);
    }

    // 사용자 타입을 확인하는 메서드
    private String getUserType(User user) {
        if (user instanceof NormalUser) {
            return "normal";
        } else if (user instanceof BrandUser) {
            return "brand";
        } else if (user instanceof SuperUser) {
            return "super";
        } else {
            throw new IllegalArgumentException("알 수 없는 사용자 타입입니다.");
        }
    }

    // 액세스 토큰 갱신 메서드
    public RefreshTokenResponse refreshAccessToken(String refreshToken) {
        // 리프레시 토큰이 블랙리스트에 있는지 확인
        if (jwtUtil.isTokenBlacklisted(refreshToken)) {
            throw new IllegalArgumentException("리프레시 토큰이 블랙리스트에 있습니다.");
        }

        // 리프레시 토큰이 유효한지 검증
        if (jwtUtil.validateRefreshToken(refreshToken)) {
            String userId = jwtUtil.getUserId(refreshToken);
            // 사용자 정보를 데이터베이스에서 조회
            User user = findUserById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

            // 사용자 타입을 가져오기
            String userType = getUserType(user);
            log.info("userId = {}, userType = {}", userId, userType);

            // 새로운 액세스 토큰 발급
            String newAccessToken = jwtUtil.createJwt(userId, userType);

            return new RefreshTokenResponse(userId, newAccessToken);  // 리프레시 토큰은 반환하지 않음
        }

        throw new IllegalArgumentException("유효하지 않은 리프레시 토큰입니다.");
    }



    public void logout(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            jwtUtil.blacklistToken(token);
            log.info("로그아웃 처리됨. 토큰 블랙리스트에 추가됨: {}", token);
        }
    }
/*
    public void logout(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            log.warn("로그아웃 요청에서 Authorization 헤더가 누락되었거나 Bearer 토큰이 아닙니다.");
            throw new IllegalArgumentException("Authorization 헤더가 누락되었거나 Bearer 토큰이 아닙니다.");
        }

        String token = authorizationHeader.substring(7);

        if (jwtUtil.isTokenBlacklisted(token)) {
            log.info("로그아웃 처리됨. 토큰이 이미 블랙리스트에 존재함: {}", token);
            return;
        }

        if (!jwtUtil.validateToken(token)) {
            log.info("유효하지 않은 액세스 토큰: {}", token);
            throw new IllegalArgumentException("유효하지 않은 액세스 토큰입니다.");
        }

        jwtUtil.blacklistToken(token);
        log.info("로그아웃 처리됨. 액세스 토큰을 블랙리스트에 추가함: {}", token);
    }

 */


    public String uploadImage(String userId, MultipartFile file) {
        Optional<NormalUser> normalUser = normalUserRepository.findById(userId);
        Optional<BrandUser> brandUser = brandUserRepository.findById(userId);
        Optional<SuperUser> superUser = superUserRepository.findById(userId);

        if (normalUser.isPresent()) {
            return saveUserImage(normalUser.get(), file);
        } else if (brandUser.isPresent()) {
            return saveUserImage(brandUser.get(), file);
        } else if (superUser.isPresent()) {
            return saveUserImage(superUser.get(), file);
        }
        return null;
    }

    private String saveUserImage(Object user, MultipartFile file) {
        if (file.isEmpty()) {
            return null;
        }

        String filePath = null;
        try {
            if (user instanceof NormalUser) {
                NormalUser normalUser = (NormalUser) user;
                String fileName = normalUser.getId() + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
                filePath = imageProperties.getFullUploadDir() + fileName;
                file.transferTo(new File(filePath)); //업로드 된 파일을 지정된 경로에 저장
                normalUser.setUserImageUrl(filePath);
                normalUserRepository.save(normalUser);
            } else if (user instanceof BrandUser) {
                BrandUser brandUser = (BrandUser) user;
                String fileName = brandUser.getId() + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
                filePath = imageProperties.getFullUploadDir() + fileName;
                file.transferTo(new File(filePath));
                brandUser.setUserImageUrl(filePath);
                brandUserRepository.save(brandUser);
            } else if (user instanceof SuperUser) {
                SuperUser superUser = (SuperUser) user;
                String fileName = superUser.getId() + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
                filePath = imageProperties.getFullUploadDir() + fileName;
                file.transferTo(new File(filePath));
                superUser.setUserImageUrl(filePath);
                superUserRepository.save(superUser);
            }
            logger.info("이미지 업로드 성공: {}", filePath);
        } catch (IOException e) {
            logger.error("이미지 업로드 실패", e);
            return null;
        }
        return filePath; // 파일의 경로를 반환
    }


    // 사용자의 기존 이미지 URL을 가져오는 메서드
    public String getUserImageUrl(String userId) {
        Optional<NormalUser> normalUser = normalUserRepository.findById(userId);
        Optional<BrandUser> brandUser = brandUserRepository.findById(userId);
        Optional<SuperUser> superUser = superUserRepository.findById(userId);

        if (normalUser.isPresent()) {
            logger.info("NormalUser 이미지 URL: {}", normalUser.get().getUserImageUrl());
            return normalUser.get().getUserImageUrl();
        } else if (brandUser.isPresent()) {
            logger.info("BrandUser 이미지 URL: {}", brandUser.get().getUserImageUrl());
            return brandUser.get().getUserImageUrl();
        } else if (superUser.isPresent()) {
            logger.info("SuperUser 이미지 URL: {}", superUser.get().getUserImageUrl());
            return superUser.get().getUserImageUrl();
        } else {
            return null; // 사용자가 존재하지 않는 경우
        }
    }


    // AI 서버에서 이미지 URL을 전달받아 해당 이미지 파일을 전송하는 메서드
    public byte[] getImageFileByUrl(String imageUrl) throws IOException {
        // 이미지 파일의 절대 경로를 확인합니다.
        Path imagePath = Paths.get(imageUrl);
        logger.info("이미지 파일 경로: {}", imagePath);
        // 이미지 파일이 존재하는지 확인합니다.
        if (Files.exists(imagePath)) {
            // 이미지 파일이 존재하면 파일의 내용을 byte 배열로 읽어옵니다.
            logger.info("[AI 서버에 이미지 전송] 이미지 파일 경로: {}", imagePath);
            return Files.readAllBytes(imagePath);
        } else {
            // 이미지 파일이 존재하지 않는 경우 FileNotFoundException을 던집니다.
            throw new FileNotFoundException("이미지 파일이 존재하지 않습니다.");
        }
    }


    //user profile 경로 base64인코딩 및 디코딩 수행
    public String uploadProfileImage(String userId, MultipartFile file) {
        Optional<NormalUser> normalUser = normalUserRepository.findById(userId);
        Optional<BrandUser> brandUser = brandUserRepository.findById(userId);
        Optional<SuperUser> superUser = superUserRepository.findById(userId);

        if (normalUser.isPresent()) {
            return saveProfileImage(normalUser.get(), file);
        } else if (brandUser.isPresent()) {
            return saveProfileImage(brandUser.get(), file);
        } else if (superUser.isPresent()) {
            return saveProfileImage(superUser.get(), file);
        }
        return null;
    }

    private String saveProfileImage(User user, MultipartFile file) {
        if (file.isEmpty()) {
            return null;
        }

        try {
            String fileName = user.getId() + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String filePath = imageProperties.getFullProfileDir() + fileName;
            file.transferTo(new File(filePath));  // 프로필 이미지 파일을 지정된 경로에 저장

            // 경로를 Base64로 safe 인코딩 방식
            String encodedPath = Base64.getUrlEncoder().encodeToString(filePath.getBytes());

            user.setUserProfileImageUrl(encodedPath);
            if (user instanceof NormalUser) {
                normalUserRepository.save((NormalUser) user);
            } else if (user instanceof BrandUser) {
                brandUserRepository.save((BrandUser) user);
            } else if (user instanceof SuperUser) {
                superUserRepository.save((SuperUser) user);
            }

            logger.info("프로필 이미지 업로드 성공: {}", encodedPath);
            return encodedPath;
        } catch (IOException e) {
            logger.error("프로필 이미지 업로드 실패", e);
            return null;
        }
    }

    public byte[] getProfileImage(String userId) throws IOException {
        Optional<NormalUser> normalUser = normalUserRepository.findById(userId);
        Optional<BrandUser> brandUser = brandUserRepository.findById(userId);
        Optional<SuperUser> superUser = superUserRepository.findById(userId);

        String encodedPath = null;

        if (normalUser.isPresent()) {
            encodedPath = normalUser.get().getUserProfileImageUrl();
        } else if (brandUser.isPresent()) {
            encodedPath = brandUser.get().getUserProfileImageUrl();
        } else if (superUser.isPresent()) {
            encodedPath = superUser.get().getUserProfileImageUrl();
        }

        if (encodedPath == null) {
            throw new FileNotFoundException("이미지 파일이 존재하지 않습니다.");
        }

        // Base64로 인코딩된 경로를 safe 디코딩하여 실제 파일 경로 얻기
        byte[] decodedBytes = Base64.getUrlDecoder().decode(encodedPath);
        String filePath = new String(decodedBytes);

        Path imagePath = Paths.get(filePath);
        if (Files.exists(imagePath)) {
            return Files.readAllBytes(imagePath);
        } else {
            throw new FileNotFoundException("이미지 파일이 존재하지 않습니다.");
        }
    }


}
