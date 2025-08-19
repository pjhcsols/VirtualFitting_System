// src/main/java/basilium/basiliumserver/domain/productDiscount/controller/ProductDiscountController.java
package basilium.basiliumserver.domain.productDiscount.controller;


/*
@RequiredArgsConstructor
@RestController
@RequestMapping("/b1")
public class ProductDiscountController {

    private final ProductDiscountService service;

    */
/* ===== 브랜드 전용 ===== *//*


    */
/** 생성 *//*

    @PreAuthorize("hasRole('BRAND') and #userId == authentication.principal")
    @PostMapping("/brand/discounts/product")
    public ResponseEntity<ApiResponse<ProductDiscountDtos.ProductDiscountResponse>> create(
            @AuthUser String userId,
            @Valid @RequestBody ProductDiscountDtos.ProductDiscountRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(service.create(userId, req)));
    }

    */
/** 부분 수정 (percent 또는 amount 중 하나) *//*

    @PreAuthorize("hasRole('BRAND') and #userId == authentication.principal")
    @PatchMapping("/brand/discounts/product/{discountId}")
    public ResponseEntity<ApiResponse<ProductDiscountDtos.ProductDiscountResponse>> update(
            @AuthUser String userId,
            @PathVariable Long discountId,
            @Valid @RequestBody ProductDiscountDtos.ProductDiscountUpdateRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(service.update(userId, discountId, req)));
    }

    */
/** 활성/비활성 토글 *//*

    @PreAuthorize("hasRole('BRAND') and #userId == authentication.principal")
    @PatchMapping("/brand/discounts/product/{discountId}/active")
    public ResponseEntity<ApiResponse<Void>> setActive(
            @AuthUser String userId,
            @PathVariable Long discountId,
            @RequestParam boolean active
    ) {
        service.setActive(userId, discountId, active);
        return ResponseEntity.ok(ApiResponse.success());
    }

    */
/** 삭제 *//*

    @PreAuthorize("hasRole('BRAND') and #userId == authentication.principal")
    @DeleteMapping("/brand/discounts/product/{discountId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthUser String userId,
            @PathVariable Long discountId
    ) {
        service.delete(userId, discountId);
        return ResponseEntity.ok(ApiResponse.success());
    }

    */
/** 내 할인 목록 (옵션: 특정 상품으로 필터) *//*

    @PreAuthorize("hasRole('BRAND') and #userId == authentication.principal")
    @GetMapping("/brand/discounts/product/mine")
    public ResponseEntity<ApiResponse<Page<ProductDiscountDtos.ProductDiscountResponse>>> mine(
            @AuthUser String userId,
            @RequestParam(required = false) Long productId,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(service.listMyDiscounts(userId, productId, pageable)));
    }

    */
/** 브랜드 유저 상품의 현재 유효 할인 요약(상품별 최댓값 %) *//*

    @PreAuthorize("hasRole('BRAND') and #userId == authentication.principal")
    @GetMapping("/brand/discounts/product/mine/active/summary")
    public ResponseEntity<ApiResponse<Page<ProductDiscountDtos.ActiveSummaryResponse>>> activeSummary(
            @AuthUser String userId,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(service.listMyActiveSummary(userId, pageable)));
    }

    */
/** (서버 가격 파이프라인용) 현재 유효 퍼센트 *//*

    @GetMapping("/brand/discounts/product/active-percent/{productId}")
    public ResponseEntity<ApiResponse<Integer>> activePercent(@PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.success(service.getActivePercentNow(productId)));
    }

    */
/* ===== 일반 유저 공개 가격 ===== *//*


    */
/** 단건 공개 가격 (= 원가/할인%/할인금액/할인가) *//*

    @GetMapping("/products/{productId}/price")
    public ResponseEntity<ApiResponse<ProductDiscountDtos.PublicPriceView>> publicPrice(
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(ApiResponse.success(service.getPublicPrice(productId)));
    }

    */
/** 배치 공개 가격 — /b1/products/prices?ids=1,2,3 *//*

    @GetMapping("/products/prices")
    public ResponseEntity<ApiResponse<List<ProductDiscountDtos.PublicPriceView>>> publicPrices(
            @RequestParam List<Long> ids
    ) {
        return ResponseEntity.ok(ApiResponse.success(service.getPublicPrices(ids)));
    }
}
*/
