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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;


//user 통합 로그인 로그아웃 이미지 업로드
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
/*
    private String saveUserImage(Object user, MultipartFile file) {
        if (file.isEmpty()) {
            return null;
        }

        try {
            String fileName = user.getId() + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String filePath = uploadDir + fileName;
            file.transferTo(new File(filePath));
            if (user instanceof NormalUser) {
                NormalUser normalUser = (NormalUser) user;
                normalUser.setUserImageUrl(filePath);
                normalUserRepository.save(normalUser);
            } else if (user instanceof BrandUser) {
                BrandUser brandUser = (BrandUser) user;
                brandUser.setUserImageUrl(filePath);
                brandUserRepository.save(brandUser);
            } else if (user instanceof SuperUser) {
                SuperUser superUser = (SuperUser) user;
                superUser.setUserImageUrl(filePath);
                superUserRepository.save(superUser);
            }
            return filePath;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

 */
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
                file.transferTo(new File(filePath));
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



}
