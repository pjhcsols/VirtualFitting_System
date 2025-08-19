package basilium.basiliumserver.domain.discount.controller;

import basilium.basiliumserver.domain.discount.controller.apiDocs.DiscountApiDocs;
import basilium.basiliumserver.domain.discount.dto.*;
import basilium.basiliumserver.domain.discount.service.DiscountService;
import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.auth.support.AuthUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//브랜드 유저가 설정한 상품 및 일반 유저(특정 상품, 브랜드 전체) 할인을 전체 조회, 관리, 수정할수있어야된다
@RestController
@RequiredArgsConstructor
@RequestMapping("/b1/discounts")
public class DiscountController implements DiscountApiDocs {

    private final DiscountService service;

    /* ================= 가격 견적 ================= */
    /** 클라이언트 충돌 방지: “금액만 별도 제공” */
    @GetMapping("/quote")
    public ResponseEntity<ApiResponse<PriceQuoteDTO>> quote(
            @RequestParam Long productId,
            @RequestParam(required = false) String userId
    ) {
        return ResponseEntity.ok(ApiResponse.success(service.quote(productId, userId)));
    }

    /* ================= ProductDiscount (브랜드 전용) ================= */

    /** 생성 (하위호환: 기존 경로도 매핑) */
    @PreAuthorize("hasRole('BRAND') and #userId == authentication.principal")
    @PostMapping(value = {"/brand/product", "/brand/discounts/product"})
    public ResponseEntity<ApiResponse<ProductDiscountDtos.ProductDiscountResponse>> createProduct(
            @AuthUser String userId,
            @Valid @RequestBody ProductDiscountDtos.ProductDiscountRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(service.createProductDiscount(userId, req)));
    }

    /** 부분 수정 */
    @PreAuthorize("hasRole('BRAND') and #userId == authentication.principal")
    @PatchMapping(value = {"/brand/product/{discountId}", "/brand/discounts/product/{discountId}"})
    public ResponseEntity<ApiResponse<ProductDiscountDtos.ProductDiscountResponse>> updateProduct(
            @AuthUser String userId,
            @PathVariable Long discountId,
            @Valid @RequestBody ProductDiscountDtos.ProductDiscountUpdateRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(service.updateProductDiscount(userId, discountId, req)));
    }

    /** 활성 토글 */
    @PreAuthorize("hasRole('BRAND') and #userId == authentication.principal")
    @PatchMapping(value = {"/brand/product/{discountId}/active", "/brand/discounts/product/{discountId}/active"})
    public ResponseEntity<ApiResponse<Void>> setActiveProduct(
            @AuthUser String userId,
            @PathVariable Long discountId,
            @RequestParam boolean active
    ) {
        service.setActiveProductDiscount(userId, discountId, active);
        return ResponseEntity.ok(ApiResponse.success());
    }

    /** 삭제 */
    @PreAuthorize("hasRole('BRAND') and #userId == authentication.principal")
    @DeleteMapping(value = {"/brand/product/{discountId}", "/brand/discounts/product/{discountId}"})
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @AuthUser String userId,
            @PathVariable Long discountId
    ) {
        service.deleteProductDiscount(userId, discountId);
        return ResponseEntity.ok(ApiResponse.success());
    }

    /** 내 할인 목록 (옵션: 특정 상품) */
    @PreAuthorize("hasRole('BRAND') and #userId == authentication.principal")
    @GetMapping(value = {"/brand/product/mine", "/brand/discounts/product/mine"})
    public ResponseEntity<ApiResponse<Page<ProductDiscountDtos.ProductDiscountResponse>>> mine(
            @AuthUser String userId,
            @RequestParam(required = false) Long productId,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(service.listMyDiscounts(userId, productId, pageable)));
    }

    /** 내 현재 유효 요약(상품별 최댓값 %) */
    @PreAuthorize("hasRole('BRAND') and #userId == authentication.principal")
    @GetMapping(value = {"/brand/product/mine/active/summary", "/brand/discounts/product/mine/active/summary"})
    public ResponseEntity<ApiResponse<Page<ProductDiscountDtos.ActiveSummaryResponse>>> activeSummary(
            @AuthUser String userId,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(service.listMyActiveSummary(userId, pageable)));
    }

    /** 서버 파이프라인용: 현재 유효 퍼센트 */
    @GetMapping(value = {"/product/active-percent/{productId}", "/brand/discounts/product/active-percent/{productId}"})
    public ResponseEntity<ApiResponse<Integer>> activePercent(@PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.success(service.getActivePercentNow(productId)));
    }

    /** 공개 가격(단건/배치) */
    @GetMapping(value = {"/products/{productId}/price", "/products/price/{productId}"})
    public ResponseEntity<ApiResponse<ProductDiscountDtos.PublicPriceView>> publicPrice(
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(ApiResponse.success(service.getPublicPrice(productId)));
    }

    @GetMapping("/products/prices")
    public ResponseEntity<ApiResponse<List<ProductDiscountDtos.PublicPriceView>>> publicPrices(
            @RequestParam List<Long> ids
    ) {
        return ResponseEntity.ok(ApiResponse.success(service.getPublicPrices(ids)));
    }

    /* ================= UserDiscount (브랜드 전용) ================= */

    /** 브랜드 전상품 스코프 개인할인 */
    @PreAuthorize("hasRole('BRAND') and #authUserId == authentication.principal")
    @PostMapping("/brand/user")
    public ResponseEntity<ApiResponse<Long>> upsertForBrand(
            @AuthUser String authUserId,
            @RequestBody CreateUserDiscountRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(service.upsertUserDiscountForBrand(authUserId, req)));
    }

    /** 특정 상품 스코프 개인할인 */
    @PreAuthorize("hasRole('BRAND') and #authUserId == authentication.principal")
    @PostMapping("/brand/user/product")
    public ResponseEntity<ApiResponse<Long>> upsertForProduct(
            @AuthUser String authUserId,
            @RequestBody CreateUserDiscountRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(service.upsertUserDiscountForProduct(authUserId, req)));
    }

    /** 내 개인할인 전체 목록(브랜드/상품 스코프 모두) */
    @PreAuthorize("hasRole('BRAND') and #authUserId == authentication.principal")
    @GetMapping("/brand/user/mine")
    public ResponseEntity<ApiResponse<Page<UserDiscountDtos.UserDiscountResponse>>> listMyUserDiscounts(
            @AuthUser String authUserId,
            @RequestParam(required = false) Long targetUserNumber,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false, defaultValue = "false") boolean onlyActiveNow,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                service.listMyUserDiscounts(authUserId, targetUserNumber, productId, onlyActiveNow, pageable)
        ));
    }

    /** 개인할인 부분 수정(퍼센트/기간/활성) */
    @PreAuthorize("hasRole('BRAND') and #authUserId == authentication.principal")
    @PatchMapping("/brand/user/{discountId}")
    public ResponseEntity<ApiResponse<UserDiscountDtos.UserDiscountResponse>> updateUserDiscount(
            @AuthUser String authUserId,
            @PathVariable Long discountId,
            @Valid @RequestBody UpdateUserDiscountRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(service.updateUserDiscount(authUserId, discountId, req)));
    }

    /** 개인할인 활성/비활성 토글 */
    @PreAuthorize("hasRole('BRAND') and #authUserId == authentication.principal")
    @PatchMapping("/brand/user/{discountId}/active")
    public ResponseEntity<ApiResponse<Void>> setActiveUserDiscount(
            @AuthUser String authUserId,
            @PathVariable Long discountId,
            @RequestParam boolean active
    ) {
        service.setActiveUserDiscount(authUserId, discountId, active);
        return ResponseEntity.ok(ApiResponse.success());
    }

    /** 개인할인 삭제 */
    @PreAuthorize("hasRole('BRAND') and #authUserId == authentication.principal")
    @DeleteMapping("/brand/user/{discountId}")
    public ResponseEntity<ApiResponse<Void>> deleteUserDiscount(
            @AuthUser String authUserId,
            @PathVariable Long discountId
    ) {
        service.deleteUserDiscount(authUserId, discountId);
        return ResponseEntity.ok(ApiResponse.success());
    }
}
