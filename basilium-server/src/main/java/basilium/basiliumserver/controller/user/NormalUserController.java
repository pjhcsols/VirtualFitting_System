package basilium.basiliumserver.controller.user;

import basilium.basiliumserver.service.user.NormalUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/v1/normalUser")
public class NormalUserController {
    private final NormalUserService normalUserService;

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
        LoginStatus loginResult = normalUserService.login(loginRequest.getUserId(), loginRequest.getUserPassword());
        if (loginResult != LoginStatus.SUCCESS)return new ResponseEntity<>(loginResult.getMessage(), loginResult.getStatus());

        String token = normalUserService.afterSuccessLogin(loginRequest.getUserId());
        log.info(token);
        return ResponseEntity.ok().body(token);
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