// src/main/java/basilium/basiliumserver/domain/coupon/controller/CouponController.java
package basilium.basiliumserver.domain.coupon.controller;

import basilium.basiliumserver.domain.coupon.controller.apiDocs.CouponApiDocs;
import basilium.basiliumserver.domain.coupon.dto.CouponDtos.*;
import basilium.basiliumserver.domain.coupon.service.CouponService;
import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.auth.support.AuthUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * CouponController
 * - 브랜드 캠페인 CRUD(생성/수정/목록)
 * - 상품 상세: 발급 가능 캠페인 조회, 지갑 발급
 * - 결제 옵션(호출은 /b1/payments/options에서 서비스 사용) — 컨트롤러는 기존 결제 모듈에서 연결
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/b1/coupons")
public class CouponController implements CouponApiDocs {

    private final CouponService service;

    /* ========== 브랜드 캠페인 관리 ========== */

    /* 내가 만든 캠페인 페이지 조회 */
    @PreAuthorize("hasRole('BRAND') and #authUserId == authentication.principal")
    @GetMapping("/brands/me/campaigns")
    public ResponseEntity<ApiResponse<Page<CampaignResponse>>> myCampaigns(
            @AuthUser String authUserId, Pageable pageable) {
        Page<CampaignResponse> page = service.listMyCampaigns(authUserId, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    /* 캠페인 생성 */
    @PreAuthorize("hasRole('BRAND') and #authUserId == authentication.principal")
    @PostMapping("/brands/me/campaigns")
    public ResponseEntity<ApiResponse<CampaignResponse>> create(
            @AuthUser String authUserId, @RequestBody CampaignCreateRequest req) {
        CampaignResponse created = service.createCampaign(authUserId, req);
        return ResponseEntity.ok(ApiResponse.success(created));
    }

    /* 캠페인 수정 */
    @PreAuthorize("hasRole('BRAND') and #authUserId == authentication.principal")
    @PatchMapping("/brands/me/campaigns/{id}")
    public ResponseEntity<ApiResponse<CampaignResponse>> update(
            @AuthUser String authUserId, @PathVariable Long id, @RequestBody CampaignUpdateRequest req) {
        CampaignResponse updated = service.updateCampaign(authUserId, id, req);
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    /* ========== 상품 상세: 발급 가능 조회 & 발급 ========== */

    /* 상품 상세: 발급 가능 캠페인 리스트(브랜드/상품 범위 모두) */
    /* 상품 상세: 발급 가능 캠페인 리스트(브랜드/상품 범위 모두)
     * - 비로그인(게스트)도 접근 가능: @PreAuthorize 없음
     * - 로그인 사용자는 @AuthUser 로 authUserId 가 주입됨(미인증이면 null)
     * - 서비스에는 Optional<String> 로 넘겨 개인화(이미 발급/잔여) 표시를 선택 적용
     */
    @GetMapping("/products/{productId}/claimables")
    public ResponseEntity<ApiResponse<java.util.List<ClaimableOnProductView>>> claimablesOnProduct(
            @PathVariable Long productId,
            @Nullable @RequestParam(required = false) String normalUserId // 로그인 x 인 경우-> null
    ) {
        var list = service.listClaimablesOnProductForViewer(productId, java.util.Optional.ofNullable(normalUserId));
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    /* 상품 상세: 다운(발급) → 쿠폰을 지갑에 넣기 */
    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    @PostMapping("/wallets")
    public ResponseEntity<ApiResponse<WalletClaimResponse>> claim(
            @AuthUser String authUserId,
            @RequestBody WalletClaimRequest req
    ) {
        var resp = service.claimWallet(authUserId, req.getCampaignId());
        return ResponseEntity.ok(ApiResponse.success(resp));
    }
}
