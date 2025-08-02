// src/main/java/basilium/basiliumserver/domain/user/controller/NormalUserController.java
package basilium.basiliumserver.domain.user.controller;

import basilium.basiliumserver.domain.deliveryInfo.DeliveryInfo;
import basilium.basiliumserver.domain.user.dto.NormalUserModifiedInfo;
import basilium.basiliumserver.domain.user.dto.NormalUserSignupDTO;
import basilium.basiliumserver.domain.user.dto.NormalUserInfoDTO;
import basilium.basiliumserver.domain.user.entity.JoinStatus;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import basilium.basiliumserver.domain.user.service.NormalUserService;
import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.auth.support.AuthUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 일반 유저의 등급 변화 가능해야됨
//@PreAuthorize("isAuthenticated()")
@Slf4j
@RestController
@RequestMapping("/b1/normalUsers")
@RequiredArgsConstructor
public class NormalUserController {

    private final NormalUserService normalUserService;

    /**
     * POST /b1/users
     * 노말 유저 회원가입
     */
    @PostMapping
    public ResponseEntity<ApiResponse<String>> signup(
            @Valid @RequestBody NormalUserSignupDTO dto) {

        JoinStatus result = normalUserService.join(dto);
        return ResponseEntity.status(result.getStatus()).body(ApiResponse.success(result.getMessage()));
    }

    /**
     * GET /b1/users
     * 전체 노말 유저 목록 조회
     */
    @PreAuthorize("hasRole('SUPER') and #userId == authentication.principal")
    @GetMapping
    public ResponseEntity<ApiResponse<List<NormalUser>>> list(@AuthUser String userId) {
        List<NormalUser> users = normalUserService.getAllNormalUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    /**
     * PATCH /b1/users/me
     * 로그인된 유저 정보 수정
     */
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<String>> updateMe(
            @AuthUser String userId,
            @Valid @RequestBody NormalUserModifiedInfo info) {

        normalUserService.modify(userId, info);
        return ResponseEntity.ok(ApiResponse.success("성공적으로 변경되었습니다."));
    }

    /**
     * GET /b1/users/me
     * 로그인된 유저 기본 정보 조회
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<NormalUser>> getMe(
            @AuthUser String userId) {

        NormalUser user = normalUserService.userInfoById(userId);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    //like -> likecontroller에 존재 / 디테일info -> 배송정보 이관할것 / 리뷰 제거
    /**
     * GET /b1/users/me/detail
     * 로그인된 유저 상세 정보 조회 (배송정보 포함)
     */
    @GetMapping("/me/detail")
    public ResponseEntity<ApiResponse<NormalUserInfoDTO>> getMeDetail(
            @AuthUser String userId) {

        NormalUser u = normalUserService.userInfoById(userId);
        DeliveryInfo d = normalUserService.deliveryInfoByUserNumber(u.getUserNumber());
        return ResponseEntity.ok(ApiResponse.success(new NormalUserInfoDTO(u, d)));
    }

    /**
     * POST /b1/users/me/review
     * 로그인된 유저 리뷰 등록 (임시)
     */
    @PostMapping("/me/review")
    public ResponseEntity<ApiResponse<String>> writeReview(
            @AuthUser String userId) {

        return ResponseEntity.ok(ApiResponse.success("리뷰 등록이 완료되었습니다."));
    }
}
