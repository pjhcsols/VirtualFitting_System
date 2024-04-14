package basilium.basiliumserver.controller.user;

import basilium.basiliumserver.domain.user.LoginRequest;
import basilium.basiliumserver.domain.user.LoginStatus;
import basilium.basiliumserver.service.user.UserStateService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


//user 통합 로그인
@Slf4j
@RestController
@RequestMapping("/User")
@PreAuthorize("isAuthenticated()")
public class UserStateController {

    private final UserStateService userStateService;

    //bean
    @Autowired
    public UserStateController(UserStateService userStateService) {
        this.userStateService = userStateService;
    }

/*
    @PostMapping("/login")
    public ResponseEntity<String> loginNormalUser(@RequestBody LoginRequest loginRequest) {
        log.info("------------------------------------------------------------");
        log.info("1. User 로그인 시도");
        log.info("ID: " + loginRequest.getUserId() + " ");
        log.info("Password: " + loginRequest.getUserPassword() + " ");
        LoginStatus loginResult = userStateService.login(loginRequest.getUserId(), loginRequest.getUserPassword());
        if (loginResult != LoginStatus.SUCCESS)
            return new ResponseEntity<>(loginResult.getMessage(), loginResult.getStatus());
        log.info("------------------------------------------------------------");
        log.info("2. 로그인 성공");
        String token = userStateService.afterSuccessLogin(loginRequest.getUserId());
        log.info("[User 토큰 정상 발급]");
        log.info(token);
        return ResponseEntity.ok().body(token);
    }

 */
    @PostMapping("/login")
    public ResponseEntity<String> loginNormalUser(@RequestBody LoginRequest loginRequest) {
        log.info("------------------------------------------------------------");
        log.info("1. User 로그인 시도");
        log.info("ID: " + loginRequest.getUserId() + " ");
        log.info("Password: " + loginRequest.getUserPassword() + " ");
        LoginStatus loginResult = userStateService.login(loginRequest.getUserId(), loginRequest.getUserPassword());
        if (loginResult != LoginStatus.SUCCESS) {
            return new ResponseEntity<>(loginResult.getMessage(), loginResult.getStatus());
        }
        log.info("------------------------------------------------------------");
        log.info("2. 로그인 성공");
        // 로그인 성공 후 토큰 생성
        //노말 유저에 아이디가 없으면 브랜드 유저, 브랜드유저에도 아이디가 없으면, 슈퍼유저에서 토큰을 생성
        String token = userStateService.createTokenByUserType(loginRequest.getUserId());
        log.info("[User 토큰 정상 발급]");
        log.info(token);
        return ResponseEntity.ok().body(token);
    }

    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        try {
            userStateService.logout(request);
            return new ResponseEntity<>("로그아웃 성공", HttpStatus.OK);
        } catch (Exception e) {
            //return new ResponseEntity<>("로그아웃 실패: " + e.getMessage(), HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>("로그아웃 실패", HttpStatus.BAD_REQUEST);
        }
    }
}
