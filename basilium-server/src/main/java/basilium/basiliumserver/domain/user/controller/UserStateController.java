// src/main/java/basilium/basiliumserver/domain/user/controller/UserStateController.java
package basilium.basiliumserver.domain.user.controller;

import basilium.basiliumserver.domain.user.dto.LoginRequest;
import basilium.basiliumserver.domain.user.dto.LoginResponse;
import basilium.basiliumserver.domain.user.dto.RefreshTokenResponse;
import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.auth.support.AuthUser;
import basilium.basiliumserver.domain.user.service.UserStateService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Paths;

@Slf4j
@RestController
@RequestMapping("/b1/users")
@RequiredArgsConstructor
public class UserStateController {

    private final UserStateService userStateService;

    /** 로그인 */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest req) {
        LoginResponse resp = userStateService.login(req.getUserId(), req.getUserPassword());
        if (resp.getType() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(basilium.basiliumserver.global.apiResponse.ErrorCode.UNAUTHENTICATED, "로그인 실패"));
        }
        /*
        Optional.ofNullable(resp.getType())
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.UNAUTHENTICATED, "로그인 실패"));
         */
        return ResponseEntity.ok(ApiResponse.success(resp));
    }

    /** 로그아웃 */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(HttpServletRequest request) {
        userStateService.logout(request);
        return ResponseEntity.ok(ApiResponse.success("로그아웃 성공"));
    }

    /** 회원 탈퇴 */
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> withdraw(@AuthUser String userId) {
        userStateService.deleteUser(userId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.success());
    }

    /** 액세스 토큰 재발급 */
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<RefreshTokenResponse>> refreshToken(@RequestParam String refreshToken) {
        RefreshTokenResponse resp = userStateService.refreshAccessToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success(resp));
    }

    /* -------- 일반 이미지 -------- */

    /** 이미지 업로드 → URL 반환 */
    @PostMapping(value = "/me/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> uploadImage(@AuthUser String userId, @RequestPart("file") MultipartFile file) {
        String url = userStateService.uploadImage(userId, file);
        return ResponseEntity.ok(ApiResponse.success(url));
    }

    /** 저장된 이미지 URL 조회 */
    @GetMapping("/me/image")
    public ResponseEntity<ApiResponse<String>> getImageUrl(@AuthUser String userId) {
        String url = userStateService.getUserImageUrl(userId);
        return ResponseEntity.ok(ApiResponse.success(url));
    }

    /** (AI) 이미지 파일 바이트 전송 */
    @PostMapping("/image/file")
    public ResponseEntity<byte[]> getImageFileByUrl(@RequestBody String imageUrl) {
        String fileName = Paths.get(imageUrl).getFileName().toString();
        byte[] data = userStateService.getImageFileByUrl(imageUrl);
        MediaType mt = userStateService.resolveMediaType(fileName);
        return ResponseEntity.ok().contentType(mt).body(data);
    }

    /* -------- 프로필 이미지 -------- */

    /** 프로필 이미지 업로드 → URL 반환 */
    @PostMapping(value = "/me/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> uploadProfileImage(@AuthUser String userId, @RequestPart("file") MultipartFile file) {
        String url = userStateService.uploadProfileImage(userId, file);
        return ResponseEntity.ok(ApiResponse.success(url));
    }

    /** 프로필 이미지 바이너리 조회 (정적 서빙 사용 시 생략 가능) */
    @GetMapping("/me/profile-image")
    public ResponseEntity<byte[]> getProfileImage(@AuthUser String userId) {
        byte[] data = userStateService.getProfileImage(userId);
        // 사용자별 확장자를 모르면 JPEG 우선, 필요 시 서비스에서 MediaType 판단 가능
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(data);
    }
}
