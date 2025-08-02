// src/main/java/basilium/basiliumserver/domain/user/controller/BrandUserController.java
package basilium.basiliumserver.domain.user.controller;

import basilium.basiliumserver.domain.user.dto.MyBusinessCertDto;
import basilium.basiliumserver.domain.user.entity.BrandUser;
import basilium.basiliumserver.domain.user.entity.JoinStatus;
import basilium.basiliumserver.domain.user.service.BrandUserService;
import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.auth.support.AuthUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/b1/brandUsers")
@Validated
@RequiredArgsConstructor
public class BrandUserController {

    private final BrandUserService brandUserService;

    /** 회원가입 */
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<String>> signup(
            @Valid @RequestBody BrandUser newUser) {
        JoinStatus st = brandUserService.join(newUser);
        return ResponseEntity.status(st.getStatus())
                .body(ApiResponse.success(st.getMessage()));
    }

    /** 내 정보 조회 */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<BrandUser>> getMe(
            @AuthUser String userId) {
        BrandUser u = brandUserService.getProfile(userId);
        return ResponseEntity.ok(ApiResponse.success(u));
    }

    /** 내 정보 수정 */
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<Void>> updateMe(
            @AuthUser String userId,
            @Valid @RequestBody BrandUser updated) {
        brandUserService.modifyProfile(userId, updated);
        return ResponseEntity.ok(ApiResponse.success());
    }

    /** 내 사업자 등록증 조회 */
    @GetMapping("/me/business-cert")
    public ResponseEntity<ApiResponse<MyBusinessCertDto>> getMyCert(
            @AuthUser String userId) {
        MyBusinessCertDto dto = brandUserService.getMyBusinessCertInfo(userId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    /** 내 사업자 등록증 업로드 */
    @PostMapping(value = "/me/business-cert",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> uploadMyCert(
            @AuthUser String userId,
            @RequestPart("file") MultipartFile file) {
        String fn = brandUserService.uploadBusinessCert(userId, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(fn));
    }

    /** 관리자: 사업자 등록증 수정 */
    @PutMapping(value = "/{userNumber}/business-cert",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> adminUpdateCert(
            @AuthUser String adminId,
            @PathVariable Long userNumber,
            @RequestPart("file") MultipartFile file) {
        String fn = brandUserService.adminUpdateBusinessCert(adminId, userNumber, file);
        return ResponseEntity.ok(ApiResponse.success(fn));
    }

    /** 관리자: 사업자 등록증 삭제 */
    @DeleteMapping("/{userNumber}/business-cert")
    public ResponseEntity<ApiResponse<Void>> adminDeleteCert(
            @AuthUser String adminId,
            @PathVariable Long userNumber) {
        brandUserService.adminDeleteBusinessCert(adminId, userNumber);
        return ResponseEntity.noContent().build();
    }

    /** 관리자: 판매 권한 설정 */
    @PatchMapping("/{userNumber}/permissions")
    public ResponseEntity<ApiResponse<Void>> adminSetPermission(
            @AuthUser String adminId,
            @PathVariable Long userNumber,
            @RequestParam boolean saleAllowed) {
        brandUserService.adminSetSaleAllowed(adminId, userNumber, saleAllowed);
        return ResponseEntity.ok(ApiResponse.success());
    }

    /** 관리자: 전체 브랜드 유저 조회 */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<BrandUser>>> listAll() {
        List<BrandUser> list = brandUserService.getAllBrandUsers();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    // 기타 브랜드 유저 상품 등록 삭제 수정 기능 로직 구현
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

    //스케줄러 용
    @GetMapping("/findById/{userId}")
    public ResponseEntity<BrandUser> getUserById(@PathVariable("userId") String userId) {
        // BrandUser를 id로 조회합니다.
        return brandUserService.findById(userId)
                .map(user -> ResponseEntity.ok().body(user)) // BrandUser가 존재하는 경우 200 OK와 함께 반환합니다.
                .orElse(ResponseEntity.notFound().build()); // BrandUser가 존재하지 않는 경우 404 Not Found를 반환합니다.
    }
}
