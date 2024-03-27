package basilium.basiliumserver.service.user;

import basilium.basiliumserver.domain.user.NormalUser;
import basilium.basiliumserver.repository.user.NormalUserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
/*
public class NormalUserService {
}

 */
@Slf4j
@Transactional
public class NormalUserService {
    private final NormalUserRepository normalUserRepository;

    @Value("${jwt.secret}")
    private String secretKey;
    private Long expiredMs = 1000 * 60 * 60l;


    public NormalUserService(NormalUserRepository normalUserRepository) {
        this.normalUserRepository = normalUserRepository;
    }

    public JoinStatus join(NormalUser normalUser){

        try{
            validateDuplicateMember(normalUser);
        }
        catch (IllegalStateException e){
            System.out.println(e);
            return JoinStatus.DUPLICATE;
        }
        try{
            checkPasswordLength(normalUser);
        }
        catch (IllegalStateException e){
            System.out.println(e);
            return JoinStatus.INVALID_PASSWORD_LENGTH;
        }
        try{
            checkStrongPassword(normalUser);
        }
        catch (IllegalStateException e)
        {
            System.out.println(e);
            return JoinStatus.INVALID_PASSWORD_STRENGTH;
        }

        normalUserRepository.save(normalUser);
        return JoinStatus.SUCCESS;
    }
    //////////jwt
    public String afterSuccessLogin(String userId) {
        //return JwtUtil.createJwt(userEmail, "normal", secretKey, expiredMs);
        return JwtUtil.createJwt(userId, secretKey, expiredMs);
    }

    public NormalUser getUserInfoByJWT(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        String jwtToken = "";

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwtToken = authorizationHeader.substring(7);
        }

        String userEmail = JwtUtil.getUserName(jwtToken, secretKey);
        Optional<NormalUser> ret = normalUserRepository.findByEmail(userEmail);
        return ret.orElse(null);
    }

    //////////////refresh

    public String createRefreshToken(String userId) {
        return JwtUtil.createRefreshToken(userId, secretKey, expiredMs);
    }

    public boolean validateRefreshToken(String refreshToken) {
        try {
            Jwts.parser().setSigningKey(secretKey.getBytes()).parseClaimsJws(refreshToken);
            return true;
        } catch (Exception e) {
            log.error("리프레시 토큰 검증 실패: {}", e.getMessage());
            return false;
        }
    }

    public String refreshAccessToken(String refreshToken) {
        if (validateRefreshToken(refreshToken)) {
            String userId = JwtUtil.getUserName(refreshToken, secretKey);
            return JwtUtil.createJwt(userId, secretKey, expiredMs);
        }
        return null;
    }



    //////////////jwt
    public LoginStatus login(String userId, String userPassword) {
        NormalUser normalUser = normalUserRepository.getUserById(userId);
        log.info(userId);
        log.info(normalUser.getUserName());
        log.info(normalUser.getUserId());
        log.info(normalUser.getPassword());
        log.info(userPassword);
        if (normalUser == null || !normalUser.getPassword().equals(userPassword)) {
            return LoginStatus.FAIL;
        }
        return LoginStatus.SUCCESS;
    }

    /**
     * 로그아웃
     */
    public void logout(HttpServletRequest request) {
        // 클라이언트 측에서 토큰을 삭제하거나 무효화하는 로직 추가
        // 여기서는 클라이언트 측에서 토큰을 삭제하는 방법으로 가정

        // 로그아웃한 토큰을 블랙리스트에 추가
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            JwtUtil.blacklistToken(token);
            log.info("토큰 블랙리스트에 추가: {}", token);
        }

        // 다른 로그아웃 관련 로직 추가 가능
    }


    private void validateDuplicateMember(NormalUser normalUser) {
        // 이미 존재하는 사용자인지 확인
        Optional<NormalUser> existingUser = normalUserRepository.findById(normalUser.getuserId());
        if (existingUser.isPresent()) {
            throw new IllegalStateException("이미 존재하는 회원입니다.");
        }
    }



    private void checkPasswordLength(NormalUser normalUser) {
        String password = normalUser.getPassword();
        if (password.length() < 8 || password.length() > 16) {
            throw new IllegalStateException("비밀번호는 8 ~ 16자 사이여야 합니다.");
        }
    }

    private void checkStrongPassword(NormalUser normalUser) {
        String password = normalUser.getPassword();
        boolean hasUpperCase = false;
        boolean hasLowerCase = false;
        boolean hasSpecialChar = false;

        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) {
                hasUpperCase = true;
            } else if (Character.isLowerCase(c)) {
                hasLowerCase = true;
            } else if ("!@#$%^&*()-_=+[]{}|;:'\",.<>/?".indexOf(c) != -1) {
                hasSpecialChar = true;
            }
        }

        if (!(hasUpperCase && hasLowerCase && hasSpecialChar)) {
            throw new IllegalStateException("비밀번호는 영문 소문자, 대문자, 특수문자를 포함해야됩니다.");
        }
    }


    public NormalUser createUser(NormalUser normalUser) {
        return normalUserRepository.createUser(user);
    }

    public NormalUser getUserById(String userId) {
        return userRepository.getUserById(userId);
    }

    public List<NormalUser> getAllUsers() {
        return normalUserRepository.getAllUsers();
    }

    public NormalUser updateUser(String userId, NormalUser updatedUser) {
        return normalUserRepository.updateUser(userId, updatedUser);
    }

    public void deleteUser(String userId) {
        normalUserRepository.deleteUser(userId);
    }

    public NormalUser getUserByEmail(String userEmail) {
        return normalUserRepository.getUserByEmail(userEmail);
    }

    public NormalUser getUserByPhoneNumber(String userPhoneNumber) {
        return normalUserRepository.getUserByPhoneNumber(userPhoneNumber);
    }

    public List<NormalUser> getUsersByUserName(String userName) {
        return normalUserRepository.getUsersByUserName(userName);
    }

    public List<NormalUser> getUsersByDepartment(String department) {
        return normalUserRepository.getUsersByDepartment(department);
    }
}