package basilium.basiliumserver.service.user;

import basilium.basiliumserver.domain.user.*;
import basilium.basiliumserver.properties.ImageProperties;
import basilium.basiliumserver.repository.user.BrandUserRepository;
import basilium.basiliumserver.repository.user.NormalUserRepository;
import basilium.basiliumserver.repository.user.SuperUserRepository;
import basilium.basiliumserver.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.nio.file.Files;
import java.io.File;
import java.io.IOException;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.ArrayList;
import java.util.List;
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


    @Autowired
    public UserStateService(NormalUserRepository normalUserRepository,
                            BrandUserRepository brandUserRepository,
                            SuperUserRepository superUserRepository,
                            ImageProperties imageProperties) {
        this.normalUserRepository = normalUserRepository;
        this.brandUserRepository = brandUserRepository;
        this.superUserRepository = superUserRepository;
        this.imageProperties = imageProperties;  // 주입된 ImageProperties 사용
    }


    @Value("${jwt.secret}")
    private String secretKey;
    private Long expiredMs = 1000 * 60 * 60l;


    public LoginResponse login(String userId, String userPassword) {
        Optional<NormalUser> normalUser = normalUserRepository.findById(userId);
        Optional<BrandUser> brandUser = brandUserRepository.findById(userId);
        Optional<SuperUser> superUser = superUserRepository.findById(userId);
        LoginResponse response = new LoginResponse();
        if (normalUser.isPresent() && normalUser.get().getPassword().equals(userPassword)) {
            response.setType("NORMAL");
            return response;
        } else if (brandUser.isPresent() && brandUser.get().getPassword().equals(userPassword)) {
            response.setType("BRAND");
            return response;
        } else if (superUser.isPresent() && superUser.get().getPassword().equals(userPassword)) {
            response.setType("ADMIN");
            return response;
        } else {
            return response;
        }
    }


    public String createTokenByUserType(String userId) {
        Optional<NormalUser> normalUser = normalUserRepository.findById(userId);
        if (normalUser.isPresent()) {
            return createNormalUserToken(userId);
        }
        else {
            // 노말 유저가 존재하지 않으면 브랜드 유저 확인
            Optional<BrandUser> brandUser = brandUserRepository.findById(userId);
            if (brandUser.isPresent()) {
                return createBrandUserToken(userId);
            }
            else {
                // 브랜드 유저가 존재하지 않으면 슈퍼 유저에서 토큰 생성
                Optional<SuperUser> superUser = superUserRepository.findById(userId);
                if (superUser.isPresent()) {
                    return createSuperUserToken(userId);
                }
                else {
                    // 브랜드 유저 및 슈퍼 유저도 존재하지 않으면 예외 처리 혹은 기본 토큰 생성 로직 추가
                    // 여기서는 슈퍼 유저가 없다고 가정하고 노말 유저 토큰 생성
                    return createNormalUserToken(userId);
                }
            }
        }
    }




    private String createNormalUserToken(String userId) {
        return JwtUtil.createJwt(userId, "normal", secretKey, expiredMs);
    }

    private String createBrandUserToken(String userId) {
        return JwtUtil.createJwt(userId, "brand", secretKey, expiredMs);
    }

    private String createSuperUserToken(String userId) {
        return JwtUtil.createJwt(userId, "super", secretKey, expiredMs);
    }



    //로그아웃
    public void logout(HttpServletRequest request) {
        // 클라이언트 측에서 토큰을 삭제하거나 무효화하는 로직 추가
        // 여기서는 클라이언트 측에서 토큰을 삭제하는 방법으로 가정

        // 로그아웃한 토큰을 블랙리스트에 추가
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            JwtUtil.blacklistToken(token);
            log.info("로그아웃 처리됨. 토큰 블랙리스트에 추가됨: {}", token);
        }
        // 다른 로그아웃 관련 로직 추가 가능
    }


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
