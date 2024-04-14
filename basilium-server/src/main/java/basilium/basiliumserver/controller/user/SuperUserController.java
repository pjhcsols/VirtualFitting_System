package basilium.basiliumserver.controller.user;


import basilium.basiliumserver.domain.user.BrandUser;
import basilium.basiliumserver.domain.user.JoinStatus;
import basilium.basiliumserver.domain.user.SuperUser;
import basilium.basiliumserver.service.user.BrandUserService;
import basilium.basiliumserver.service.user.SuperUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/superUser")
@PreAuthorize("isAuthenticated()")
public class SuperUserController {

    private final SuperUserService superUserService;

    @Autowired
    public SuperUserController(SuperUserService superUserService) {
        this.superUserService = superUserService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> createSuperUser(@RequestBody SuperUser superUser) {
        JoinStatus result = superUserService.join(superUser);
        return new ResponseEntity<>(result.getMessage(), result.getStatus());
    }

    @GetMapping("/allSuperUsers")
    public List<SuperUser> getAllSuperUsers() {
        return superUserService.getAllSuperUsers();
    }

    @PostMapping("/modify")
    public ResponseEntity<String> modifySuperUser(@RequestBody SuperUser superUser) {
        try {
            superUserService.modify(superUser);
            return ResponseEntity.ok("슈퍼 사용자 정보 수정 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("슈퍼 사용자 정보 수정 실패: " + e.getMessage());
        }
    }

    @GetMapping("/user-info")
    public ResponseEntity<SuperUser> superUserInfo(@RequestParam String userId) {
        SuperUser superUser = superUserService.userInfoById(userId);
        return ResponseEntity.ok(superUser);
    }

}
