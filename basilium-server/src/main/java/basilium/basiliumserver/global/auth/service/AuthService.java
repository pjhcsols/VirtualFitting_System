package basilium.basiliumserver.global.auth.service;

/*
import basilium.basiliumserver.auth.dto.TokenResponse;
import basilium.basiliumserver.auth.exception.AuthException;
import basilium.basiliumserver.auth.exception.AuthExceptionType;
import basilium.basiliumserver.user.domain.JoinStatus;
import basilium.basiliumserver.user.domain.LoginStatus;
import basilium.basiliumserver.user.domain.NormalUser;
import basilium.basiliumserver.repository.user.UserRepository;
import basilium.basiliumserver.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

 */
/*
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.expiredMs}")
    private Long expiredMs;

    public JoinStatus join(NormalUser user) {
        System.out.println(user.getPassword());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return JoinStatus.SUCCESS;
    }

    public LoginStatus login(String userEmail, String userPassword) {
        Optional<NormalUser> user = userRepository.findByEmailAddress(userEmail);
        if (user.isPresent()) {
            if (passwordEncoder.matches(userPassword, user.get().getPassword())) {
                return LoginStatus.SUCCESS;
            }
        }
        return LoginStatus.FAIL;
    }

    //TODO: 예외 핸들링 처리
    public TokenResponse afterSuccessLogin(String userEmail) {
        Optional<NormalUser> optionalUser = userRepository.findByEmailAddress(userEmail);
        if (optionalUser.isPresent()) {
            return new TokenResponse(jwtUtil.createJwt(optionalUser.get(), expiredMs),
                    jwtUtil.createRefreshToken(optionalUser.get(), expiredMs * 10));
        } else {
            throw new AuthException(AuthExceptionType.USER_NOT_FOUND);
        }
    }

    public String createRefreshToken(NormalUser user) {
        return jwtUtil.createRefreshToken(user, expiredMs);
    }

    public boolean validateRefreshToken(String refreshToken) {
        return jwtUtil.validateToken(refreshToken);
    }

    public String refreshAccessToken(String refreshToken) {
        if (validateRefreshToken(refreshToken)) {
            Long userId = jwtUtil.getUserId(refreshToken);
            String userEmail = jwtUtil.getUserEmail(refreshToken);
            String userTag = jwtUtil.getUserTag(refreshToken);
            return jwtUtil.createJwt(userId.toString(), userEmail, userTag, expiredMs);
        }
        return null;
    }

    public void logout(HttpServletRequest request) {
        // 클라이언트 측에서 토큰을 삭제하거나 무효화하는 로직 추가
        // 여기서는 클라이언트 측에서 토큰을 삭제하는 방법으로 가정

        // 로그아웃한 토큰을 블랙리스트에 추가
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            jwtUtil.blacklistToken(token);
            log.info("토큰 블랙리스트에 추가: {}", token);
        }
        // 다른 로그아웃 관련 로직 추가 가능
    }
}

 */