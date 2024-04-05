package basilium.basiliumserver.controller.user;

import basilium.basiliumserver.domain.user.*;
import basilium.basiliumserver.service.user.NormalUserService;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/normalUser")
@PreAuthorize("isAuthenticated()")
public class NormalUserController {
    private final NormalUserService normalUserService;

    //bean
    @Autowired
    public NormalUserController(NormalUserService normalUserService) {

        this.normalUserService = normalUserService;
    }

    @PostMapping(value = "/signup")
    public ResponseEntity<String> createNormalUser(@RequestBody NormalUser normalUser) {
        JoinStatus result = normalUserService.join(normalUser);
        return new ResponseEntity<>(result.getMessage(), result.getStatus());
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginNormalUser(@RequestBody LoginRequest loginRequest){
        log.info("-------------------" + loginRequest.getUserPassword() + "-------------------");
        LoginStatus loginResult = normalUserService.login(loginRequest.getUserId(), loginRequest.getUserPassword());
        if (loginResult != LoginStatus.SUCCESS)return new ResponseEntity<>(loginResult.getMessage(), loginResult.getStatus());
        log.info("------------------------------------------------------------");
        String token = normalUserService.afterSuccessLogin(loginRequest.getUserId());
        log.info(token);
        return ResponseEntity.ok().body(token);
    }
/*
    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        normalUserService.logout(request);
        return new ResponseEntity<>("로그아웃 성공", HttpStatus.OK);
    }

 */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        String refreshToken = refreshTokenRequest.getRefreshToken();

        if (StringUtils.isBlank(refreshToken)) {
            return ResponseEntity.badRequest().body("리프레시 토큰이 제공되지 않았습니다.");
        }

        if (normalUserService.validateRefreshToken(refreshToken)) {
            String newAccessToken = normalUserService.refreshAccessToken(refreshToken);

            if (newAccessToken != null) {
                return ResponseEntity.ok(new AccessTokenResponse(newAccessToken));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("새로운 액세스 토큰 생성에 실패했습니다.");
            }
        } else {
            return ResponseEntity.badRequest().body("유효하지 않은 리프레시 토큰입니다.");
        }
    }


    @GetMapping("/allNomalUser")
    public List<NormalUser> getAllNomalUsers() {
        return normalUserService.getAllNormalUsers();
    }

    @PostMapping("/review")
    public ResponseEntity<String> writeReview(Authentication authentication){
        return ResponseEntity.ok().body(authentication.getName() + "님의 리뷰 등록이 완료되었습니다.");

    }

    @GetMapping("/userInfo")
    public ResponseEntity<NormalUser> userInfo(HttpServletRequest request){
        log.info("시작 !!!!");
        NormalUser ret = normalUserService.getUserInfoByJWT(request);
        log.info(ret.getName());
        log.info(ret.getId());

        return ResponseEntity.ok(ret);
    }

}