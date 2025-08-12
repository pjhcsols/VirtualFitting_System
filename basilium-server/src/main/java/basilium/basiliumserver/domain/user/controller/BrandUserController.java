// src/main/java/basilium/basiliumserver/domain/user/controller/BrandUserController.java
package basilium.basiliumserver.domain.user.controller;

import basilium.basiliumserver.domain.user.dto.MyBusinessCertDto;
import basilium.basiliumserver.domain.user.entity.BrandUser;
import basilium.basiliumserver.domain.user.entity.JoinStatus;
import basilium.basiliumserver.domain.user.service.BrandUserService;
import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import basilium.basiliumserver.global.auth.support.AuthUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/b1/brandUsers")
public class BrandUserController {

    private final BrandUserService brandUserService;

    /** 회원가입 */
    //DTO 생성
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<String>> signup(
            @Valid @RequestBody BrandUser newUser
    ) {
        JoinStatus st = brandUserService.join(newUser);
        return ResponseEntity
                .status(st.getStatus())
                .body(ApiResponse.success(st.getMessage()));
    }

    /** 내 정보 조회 */
    @PreAuthorize("hasRole('BRAND') and #userId == authentication.principal")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<BrandUser>> getMe(
            @AuthUser String userId
    ) {
        BrandUser u = brandUserService.getProfile(userId);
        return ResponseEntity.ok(ApiResponse.success(u));
    }

    /** 내 정보 수정 */
    @PreAuthorize("hasRole('BRAND') and #userId == authentication.principal")
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<Void>> updateMe(
            @AuthUser String userId,
            @Valid @RequestBody BrandUser updated
    ) {
        brandUserService.modifyProfile(userId, updated);
        return ResponseEntity.ok(ApiResponse.success());
    }

    /** 내 사업자 등록증 조회 */
    @PreAuthorize("hasRole('BRAND') and #userId == authentication.principal")
    @GetMapping("/me/business-cert")
    public ResponseEntity<ApiResponse<MyBusinessCertDto>> getMyCert(
            @AuthUser String userId
    ) {
        MyBusinessCertDto dto = brandUserService.getMyBusinessCertInfo(userId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    /** 내 사업자 등록증 업로드 */
    @PreAuthorize("hasRole('BRAND') and #userId == authentication.principal")
    @PostMapping(value = "/me/business-cert",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> uploadMyCert(
            @AuthUser String userId,
            @RequestPart("file") MultipartFile file
    ) {
        String fn = brandUserService.uploadBusinessCert(userId, file);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(fn));
    }

    /** 사업자 등록증 수정 (관리자 또는 본인) */
    @PreAuthorize("hasRole('SUPER') or (hasRole('BRAND') and #userId == authentication.principal)")
    @PutMapping(value = "/{userNumber}/business-cert",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> updateCert(
            @AuthUser String userId,
            @PathVariable Long userNumber,
            @RequestPart("file") MultipartFile file
    ) {
        String fn = brandUserService.adminUpdateBusinessCert(userId, userNumber, file);
        return ResponseEntity.ok(ApiResponse.success(fn));
    }

    /** 사업자 등록증 삭제 (관리자 또는 본인) */
    @PreAuthorize("hasRole('SUPER') or (hasRole('BRAND') and #userId == authentication.principal)")
    @DeleteMapping("/{userNumber}/business-cert")
    public ResponseEntity<ApiResponse<Void>> deleteCert(
            @AuthUser String userId,
            @PathVariable Long userNumber
    ) {
        brandUserService.adminDeleteBusinessCert(userId, userNumber);
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(ApiResponse.success());
    }

    /** 판매 권한 설정 (관리자만) */
    @PreAuthorize("hasRole('SUPER')")
    @PatchMapping("/{userNumber}/permissions")
    public ResponseEntity<ApiResponse<Void>> setPermission(
            @AuthUser String userId,
            @PathVariable Long userNumber,
            @RequestParam boolean saleAllowed
    ) {
        brandUserService.adminSetSaleAllowed(userId, userNumber, saleAllowed);
        return ResponseEntity.ok(ApiResponse.success());
    }

    /** 전체 브랜드 유저 조회 (관리자만) */
    @PreAuthorize("hasRole('SUPER')")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<BrandUser>>> listAll() {
        List<BrandUser> list = brandUserService.getAllBrandUsers();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    /* 아래 코드 전체 -> 별도 test 용 */
    /** ID → UserNumber 조회 */
    @GetMapping("/findUserNumberById")
    public ResponseEntity<ApiResponse<String>> findUserNumberById(
            @RequestParam String userId
    ) {
        String num = brandUserService.findUserNumberById(userId)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.MEMBER_NOT_FOUND,
                        "유저를 찾을 수 없습니다: " + userId
                ));
        return ResponseEntity.ok(ApiResponse.success(num));
    }

    /** UserNumber → BrandUser 조회 */
    @GetMapping("/byNumber")
    public ResponseEntity<ApiResponse<BrandUser>> getByNumber(
            @RequestParam Long userNumber
    ) {
        BrandUser u = brandUserService.findByBrandUserOfNumber(userNumber)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "브랜드 유저를 찾을 수 없습니다: " + userNumber
                ));
        return ResponseEntity.ok(ApiResponse.success(u));
    }

    /** 스케줄러용: ID 로 BrandUser 조회 */
    @GetMapping("/findById/{userId}")
    public ResponseEntity<ApiResponse<BrandUser>> getById(
            @PathVariable String userId
    ) {
        BrandUser u = brandUserService.findById(userId)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.MEMBER_NOT_FOUND,
                        "브랜드 유저를 찾을 수 없습니다: " + userId
                ));
        return ResponseEntity.ok(ApiResponse.success(u));
    }
}
