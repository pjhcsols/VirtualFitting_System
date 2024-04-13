package basilium.basiliumserver.auth.controller;

import basilium.basiliumserver.auth.dto.AccessTokenResponse;
import basilium.basiliumserver.auth.dto.NormalLoginRequest;
import basilium.basiliumserver.auth.dto.RefreshTokenRequest;
import basilium.basiliumserver.auth.dto.TokenResponse;
import basilium.basiliumserver.auth.service.AuthService;
import basilium.basiliumserver.auth.support.AuthUser;
import basilium.basiliumserver.domain.user.JoinStatus;
import basilium.basiliumserver.domain.user.LoginStatus;
import basilium.basiliumserver.domain.user.NormalUser;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> createUser(@RequestBody NormalUser user) {
        JoinStatus result = authService.join(user);
        return new ResponseEntity<>(result.getMessage(), result.getStatus());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody NormalLoginRequest loginRequest) {
        LoginStatus loginResult = authService.login(loginRequest.userEmail(), loginRequest.userPassword());
        if (loginResult != LoginStatus.SUCCESS) {
            return new ResponseEntity<>(loginResult.getMessage(), loginResult.getStatus());
        }
        TokenResponse tokenResponse = authService.afterSuccessLogin(loginRequest.userEmail());
        return new ResponseEntity<>(tokenResponse, loginResult.getStatus());
    }
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, @AuthUser Long id) {
        authService.logout(request);
        return new ResponseEntity<>("로그아웃 성공", HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        String refreshToken = refreshTokenRequest.refreshToken();

        if (StringUtils.isBlank(refreshToken)) {
            return ResponseEntity.badRequest().body("리프레시 토큰이 제공되지 않았습니다.");
        }

        if (authService.validateRefreshToken(refreshToken)) {
            String newAccessToken = authService.refreshAccessToken(refreshToken);

            if (newAccessToken != null) {
                return ResponseEntity.ok(new AccessTokenResponse(newAccessToken));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("새로운 액세스 토큰 생성에 실패했습니다.");
            }
        } else {
            return ResponseEntity.badRequest().body("유효하지 않은 리프레시 토큰입니다.");
        }
    }
}
