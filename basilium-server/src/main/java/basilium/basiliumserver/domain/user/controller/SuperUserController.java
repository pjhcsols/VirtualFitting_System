// src/main/java/basilium/basiliumserver/domain/user/controller/SuperUserController.java
package basilium.basiliumserver.domain.user.controller;

import basilium.basiliumserver.domain.user.dto.MyBannerDto;
import basilium.basiliumserver.domain.user.entity.JoinStatus;
import basilium.basiliumserver.domain.user.entity.SuperUser;
import basilium.basiliumserver.domain.user.service.SuperUserService;
import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.auth.support.AuthUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/b1/superUsers")
@RequiredArgsConstructor
public class SuperUserController {
    private final SuperUserService service;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SuperUser user) {
        JoinStatus s = service.join(user);
        return ResponseEntity.status(s.getStatus()).body(s.getMessage());
    }

    /** 관리자: 전체 조회 (페이징/정렬 지원) */
    @GetMapping("/all")
    @PreAuthorize("hasRole('SUPER')")
    public ResponseEntity<ApiResponse<Page<SuperUser>>> listAll(Pageable pageable) {
        Page<SuperUser> page = service.getAllSuperUsers(pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    /** 프로필 수정 */
    @PatchMapping("/me")
    @PreAuthorize("hasRole('SUPER') and #userId == authentication.principal")
    public ResponseEntity<ApiResponse<Void>> updateMe(
            @AuthUser String userId,
            @RequestBody SuperUser updated
    ) {
        service.modifyProfile(userId, updated);
        return ResponseEntity.ok(ApiResponse.success());
    }

    /** 단일 배너 교체 (oldFileName은 Optional로) */
    @PutMapping("/me/banners")
    @PreAuthorize("hasRole('SUPER') and #userId == authentication.principal")
    public ResponseEntity<ApiResponse<String>> updateBanner(
            @AuthUser String userId,
            @RequestPart("file") MultipartFile file,
            @RequestParam(value = "oldFileName", required = false) Optional<String> oldFileName
    ) {
        String fn = service.updateBanner(userId, file, oldFileName);
        return ResponseEntity.ok(ApiResponse.success(fn));
    }

    /** 일괄 배너 교체 (최대 10장) */
    @PostMapping("/me/banners")
    @PreAuthorize("hasRole('SUPER') and #userId == authentication.principal")
    public ResponseEntity<ApiResponse<List<MyBannerDto>>> replaceBanners(
            @AuthUser String userId,
            @RequestPart("files") List<MultipartFile> files
    ) {
        List<MyBannerDto> dtos = service.replaceAllBanners(userId, files);
        return ResponseEntity.ok(ApiResponse.success(dtos));
    }

    /** 내 배너 리스트 조회 */
    @GetMapping("/me/banners")
    public ResponseEntity<ApiResponse<List<MyBannerDto>>> listBanners(
            @RequestParam("adminId") String userId
    ) {
        List<MyBannerDto> dtos = service.listMyBanners(userId);
        return ResponseEntity.ok(ApiResponse.success(dtos));
    }

    /** 특정 배너 삭제 */
    @DeleteMapping("/me/banners")
    @PreAuthorize("hasRole('SUPER') and #userId == authentication.principal")
    public ResponseEntity<ApiResponse<Void>> deleteBanner(
            @AuthUser String userId,
            @RequestParam("fileName") String fileName
    ) {
        service.deleteBanner(userId, fileName);
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(ApiResponse.success());
    }

}
