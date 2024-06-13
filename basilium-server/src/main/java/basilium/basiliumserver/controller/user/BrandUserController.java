package basilium.basiliumserver.controller.user;


import basilium.basiliumserver.domain.user.*;
import basilium.basiliumserver.service.user.BrandUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/brandUser")
@PreAuthorize("isAuthenticated()")
public class BrandUserController {

    private final BrandUserService brandUserService;

    @Autowired
    public BrandUserController(BrandUserService brandUserService) {
        this.brandUserService = brandUserService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> createBrandUser(@RequestBody BrandUser brandUser) {
        JoinStatus result = brandUserService.join(brandUser);
        return new ResponseEntity<>(result.getMessage(), result.getStatus());
    }


    @GetMapping("/allBrandUsers")
    public List<BrandUser> getAllBrandUsers() {
        return brandUserService.getAllBrandUsers();
    }

    @PostMapping("/modify")
    public ResponseEntity<String> modifyBrandUser(@RequestBody BrandUser brandUser) {
        try {
            brandUserService.modify(brandUser);
            return ResponseEntity.ok("브랜드 사용자 정보 수정 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("브랜드 사용자 정보 수정 실패: " + e.getMessage());
        }
    }

    @GetMapping("/user-info")
    public ResponseEntity<BrandUser> brandUserInfo(@RequestParam String userId) {
        BrandUser brandUser = brandUserService.userInfoById(userId);
        return ResponseEntity.ok(brandUser);
    }

    //브랜드 user id로 user number를 찾음
    @GetMapping("/findUserNumberById")
    public ResponseEntity<String> findUserNumberById(@RequestParam String userId) {
        Optional<String> userNumber = brandUserService.findUserNumberById(userId);
        return userNumber.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    //usernumber로 브랜드user객체를 불러옴
    @GetMapping("/brandUser/byNumber")
    public ResponseEntity<BrandUser> getBrandUserByNumber(@RequestParam Long userNumber) {
        Optional<BrandUser> brandUserOptional = brandUserService.findByBrandUserOfNumber(userNumber);
        return brandUserOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 기타 브랜드 유저 상품 등록 삭제 수정 기능 로직 구현

    //스케줄러 용
    @GetMapping("/findById/{userId}")
    public ResponseEntity<BrandUser> getUserById(@PathVariable("userId") String userId) {
        // BrandUser를 id로 조회합니다.
        return brandUserService.findById(userId)
                .map(user -> ResponseEntity.ok().body(user)) // BrandUser가 존재하는 경우 200 OK와 함께 반환합니다.
                .orElse(ResponseEntity.notFound().build()); // BrandUser가 존재하지 않는 경우 404 Not Found를 반환합니다.
    }
}
