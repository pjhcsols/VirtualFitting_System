package basilium.basiliumserver.service.user;

import basilium.basiliumserver.domain.user.BrandUser;
import basilium.basiliumserver.domain.user.LoginStatus;
import basilium.basiliumserver.domain.user.NormalUser;
import basilium.basiliumserver.domain.user.SuperUser;
import basilium.basiliumserver.repository.user.BrandUserRepository;
import basilium.basiliumserver.repository.user.NormalUserRepository;
import basilium.basiliumserver.repository.user.SuperUserRepository;
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
import java.util.Optional;


//user 통합 로그인 로그아웃 이미지 업로드
@Slf4j
@Transactional
@Service
public class UserStateService {

    private final NormalUserRepository normalUserRepository;
    private final BrandUserRepository brandUserRepository;
    private final SuperUserRepository superUserRepository;

    @Autowired
    //public UserStateService(NormalUserRepository normalUserRepository) {
    public UserStateService(NormalUserRepository normalUserRepository, BrandUserRepository brandUserRepository, SuperUserRepository superUserRepository) {
        this.normalUserRepository = normalUserRepository;
        this.brandUserRepository = brandUserRepository;
        this.superUserRepository = superUserRepository;
    }


    @Value("${jwt.secret}")
    private String secretKey;
    private Long expiredMs = 1000 * 60 * 60l;

    @Value("${uploadDir}")
    private String uploadDir;



    public LoginStatus login(String userId, String userPassword) {
        Optional<NormalUser> normalUser = normalUserRepository.findById(userId);
        Optional<BrandUser> brandUser = brandUserRepository.findById(userId);
        Optional<SuperUser> superUser = superUserRepository.findById(userId);

        if (normalUser.isPresent() && normalUser.get().getPassword().equals(userPassword)) {
            return LoginStatus.SUCCESS;
        } else if (brandUser.isPresent() && brandUser.get().getPassword().equals(userPassword)) {
            return LoginStatus.SUCCESS;
        } else if (superUser.isPresent() && superUser.get().getPassword().equals(userPassword)) {
            return LoginStatus.SUCCESS;
        } else {
            return LoginStatus.FAIL;
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
                filePath = uploadDir + fileName;
                file.transferTo(new File(filePath)); //업로드 된 파일을 지정된 경로에 저장
                normalUser.setUserImageUrl(filePath);
                normalUserRepository.save(normalUser);
            } else if (user instanceof BrandUser) {
                BrandUser brandUser = (BrandUser) user;
                String fileName = brandUser.getId() + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
                filePath = uploadDir + fileName;
                file.transferTo(new File(filePath));
                brandUser.setUserImageUrl(filePath);
                brandUserRepository.save(brandUser);
            } else if (user instanceof SuperUser) {
                SuperUser superUser = (SuperUser) user;
                String fileName = superUser.getId() + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
                filePath = uploadDir + fileName;
                file.transferTo(new File(filePath));
                superUser.setUserImageUrl(filePath);
                superUserRepository.save(superUser);
            }
        } catch (IOException e) {
            e.printStackTrace();
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
            System.out.println("시발 박한솔 : " + normalUser.get().getUserImageUrl());
            return normalUser.get().getUserImageUrl();
        } else if (brandUser.isPresent()) {
            System.out.println("시발 박한솔 : " + brandUser.get().getUserImageUrl());
            return brandUser.get().getUserImageUrl();
        } else if (superUser.isPresent()) {
            System.out.println("시발 박한솔 : " + superUser.get().getUserImageUrl());
            return superUser.get().getUserImageUrl();
        } else {
            return null; // 사용자가 존재하지 않는 경우
        }
    }


    // AI 서버에서 이미지 URL을 전달받아 해당 이미지 파일을 전송하는 메서드
    public byte[] getImageFileByUrl(String imageUrl) throws IOException {
        // 이미지 파일의 절대 경로를 확인합니다.
        Path imagePath = Paths.get(imageUrl);
        log.info(String.valueOf(imagePath));
        // 이미지 파일이 존재하는지 확인합니다.
        if (Files.exists(imagePath)) {
            // 이미지 파일이 존재하면 파일의 내용을 byte 배열로 읽어옵니다.
            log.info("[AI 서버에 이미지 전송]");
            log.info(String.valueOf(imagePath));
            return Files.readAllBytes(imagePath);
        } else {
            // 이미지 파일이 존재하지 않는 경우 FileNotFoundException을 던집니다.
            throw new FileNotFoundException("이미지 파일이 존재하지 않습니다.");
        }
    }


}
