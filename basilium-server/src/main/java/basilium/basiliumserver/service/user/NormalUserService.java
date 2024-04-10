package basilium.basiliumserver.service.user;

import basilium.basiliumserver.domain.user.JoinStatus;
import basilium.basiliumserver.domain.user.LoginStatus;
import basilium.basiliumserver.domain.user.NormalUser;
import basilium.basiliumserver.repository.user.NormalUserRepository;

import basilium.basiliumserver.util.JwtUtil;

import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;



@Slf4j
@Service
@Transactional //같은 아이디로 로그인한 경우 나중에 처리
public class NormalUserService {
    private final NormalUserRepository normalUserRepository;

    //bean
    @Autowired
    public NormalUserService(NormalUserRepository normalUserRepository) {
        this.normalUserRepository = normalUserRepository;
    }


    @Value("${jwt.secret}")
    private String secretKey;
    private Long expiredMs = 1000 * 60 * 60l;



    public List<NormalUser> getAllNormalUsers() {
        return normalUserRepository.getAllNormalUsers();
    }
//회원가입
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

    public LoginStatus login(String userId, String userPassword){
        Optional<NormalUser> tar = normalUserRepository.findById(userId);
        if (tar.isEmpty() || !(tar.get().getPassword().equals(userPassword))){
            return LoginStatus.FAIL;
        }
        return LoginStatus.SUCCESS;
    }

    public String afterSuccessLogin(String userId){
        return JwtUtil.createJwt(userId, "normal", secretKey, expiredMs);
    }

    private void validateDuplicateMember(NormalUser normalUser) {
        normalUserRepository.findById(normalUser.getId()).ifPresent(m->{
            throw new IllegalStateException("이미 존재하는 회원입니다.");
        });
    }
    private void checkPasswordLength(NormalUser normalUser) {
        if (normalUser.getPassword().length() >= 8 && normalUser.getPassword().length() <= 16) return;
        else throw new IllegalStateException("비밀번호는 8 ~ 16자 사이여야 합니다.");
    }
    private void checkStrongPassword(NormalUser normalUser){
        String password = normalUser.getPassword();
        boolean hasUpperCase = false;
        boolean hasLowerCase = false;
        boolean hasSpecialChar = false;
        for (char c : password.toCharArray()){
            if (Character.isUpperCase(c))
                hasUpperCase = true;
            else if (Character.isLowerCase(c))
                hasLowerCase = true;
            else if ("!@#$%^&*()-_=+[]{}|;:'\",.<>/?".indexOf(c) != -1)
                hasSpecialChar = true;
        }
        if (!(hasUpperCase && hasLowerCase && hasSpecialChar))throw new IllegalStateException("비밀번호는 영문 소문자, 대문자, 특수문자를 포함해야됩니다.");
    }

    public NormalUser getUserInfoByJWT(HttpServletRequest request){
        String authorizationHeader = request.getHeader("Authorization");
        String jwtToken = "";

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwtToken = authorizationHeader.substring(7);
        }

        String userId = JwtUtil.getUserName(jwtToken, secretKey);
        Optional<NormalUser> ret = normalUserRepository.findById(userId);
        return ret.orElse(null);
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


//리프레쉬
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
            return JwtUtil.createJwt(userId, "normal", secretKey, expiredMs);
        }
        return null;
    }

    //수정
    public void modify(NormalUser normalUser) {
        normalUserRepository.modify(normalUser);
    }

}