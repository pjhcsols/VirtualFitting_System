package basilium.basiliumserver.controller.user;


import basilium.basiliumserver.domain.user.*;
import basilium.basiliumserver.service.user.BrandUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // 기타 브랜드 유저 상품 등록 삭제 수정 기능 로직 구현
}
