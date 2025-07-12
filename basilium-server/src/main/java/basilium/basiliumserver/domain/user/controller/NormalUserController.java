// src/main/java/basilium/basiliumserver/domain/user/controller/NormalUserController.java
package basilium.basiliumserver.domain.user.controller;

import basilium.basiliumserver.domain.deliveryInfo.DeliveryInfo;
import basilium.basiliumserver.domain.user.dto.NormalUserSignupDTO;
import basilium.basiliumserver.domain.user.dto.UserModifiedInfo;
import basilium.basiliumserver.domain.user.dto.NormalUserInfoDTO;
import basilium.basiliumserver.domain.user.entity.JoinStatus;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import basilium.basiliumserver.domain.user.service.NormalUserService;
import basilium.basiliumserver.global.auth.support.AuthUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/b1/normalUser")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class NormalUserController {

    private final NormalUserService normalUserService;

    @PostMapping("/signup")
    public ResponseEntity<String> createNormalUser(
            @Valid @RequestBody NormalUserSignupDTO dto) {
        JoinStatus result = normalUserService.join(dto);
        return new ResponseEntity<>(result.getMessage(), result.getStatus());
    }

    @GetMapping("/allNormalUsers")
    public List<NormalUser> getAllNormalUsers() {
        return normalUserService.getAllNormalUsers();
    }

    @PatchMapping("/modify")
    public ResponseEntity<String> modifyUser(
            @AuthUser String userId,
            @RequestBody UserModifiedInfo info) {
        normalUserService.modify(userId, info);
        return ResponseEntity.ok("성공적으로 변경되었습니다.");
    }

    @GetMapping("/userInfo")
    public ResponseEntity<NormalUser> userInfo(@AuthUser String userId) {
        return ResponseEntity.ok(normalUserService.userInfoById(userId));
    }

    //like -> likecontroller에 존재 / 디테일info -> 배송정보 이관할것
    @GetMapping("/user/detail")
    public ResponseEntity<NormalUserInfoDTO> userDetailInfo(@AuthUser String userId) {
        NormalUser u = normalUserService.userInfoById(userId);
        DeliveryInfo d = normalUserService.deliveryInfoByUserNumber(u.getUserNumber());
        return ResponseEntity.ok(new NormalUserInfoDTO(u, d));
    }

    @PostMapping("/review")
    public ResponseEntity<String> writeReview() {
        return ResponseEntity.ok("리뷰 등록이 완료되었습니다.");
    }
}
