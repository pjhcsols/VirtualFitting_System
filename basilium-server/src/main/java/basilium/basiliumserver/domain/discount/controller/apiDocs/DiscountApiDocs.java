package basilium.basiliumserver.domain.discount.controller.apiDocs;

import basilium.basiliumserver.domain.discount.dto.CreateUserDiscountRequest;
import basilium.basiliumserver.domain.discount.dto.PriceQuoteDTO;
import basilium.basiliumserver.domain.discount.dto.ProductDiscountDtos;
import basilium.basiliumserver.domain.discount.dto.UpdateUserDiscountRequest;
import basilium.basiliumserver.domain.discount.dto.UserDiscountDtos;
import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.auth.support.AuthUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "할인 관리", description = "브랜드 상품 할인(ProductDiscount)과 개인 사용자 할인(UserDiscount) 관리 API")
@RequestMapping("/b1/discounts")
public interface DiscountApiDocs {

    /* ================= 가격 견적 ================= */

    @Operation(
            summary = "가격 견적 조회",
            description = "상품 할인(결제 기준가)과 개인 추가할인(표시/뷰)을 결합해 금액을 계산합니다."
    )
    @GetMapping("/quote")
    ResponseEntity<ApiResponse<PriceQuoteDTO>> quote(
            @RequestParam Long productId,
            @RequestParam(required = false) String userId
    );

    /* ================= ProductDiscount (브랜드 전용) ================= */

    @Operation(
            summary = "Brand: 상품 할인 생성",
            description = "percent 또는 amount 중 정확히 하나로 생성합니다. (기간/활성 포함)"
    )
    @PostMapping(value = {"/brand/product", "/brand/discounts/product"})
    ResponseEntity<ApiResponse<ProductDiscountDtos.ProductDiscountResponse>> createProduct(
            @AuthUser String userId,
            @Valid @RequestBody ProductDiscountDtos.ProductDiscountRequest req
    );

    @Operation(
            summary = "Brand: 상품 할인 부분 수정",
            description = "percent/amount 중 하나만 수정 가능합니다. 기간/활성도 부분 수정 가능."
    )
    @PatchMapping(value = {"/brand/product/{discountId}", "/brand/discounts/product/{discountId}"})
    ResponseEntity<ApiResponse<ProductDiscountDtos.ProductDiscountResponse>> updateProduct(
            @AuthUser String userId,
            @PathVariable Long discountId,
            @Valid @RequestBody ProductDiscountDtos.ProductDiscountUpdateRequest req
    );

    @Operation(
            summary = "Brand: 상품 할인 활성/비활성",
            description = "할인 엔트리의 active 값을 토글합니다."
    )
    @PatchMapping(value = {"/brand/product/{discountId}/active", "/brand/discounts/product/{discountId}/active"})
    ResponseEntity<ApiResponse<Void>> setActiveProduct(
            @AuthUser String userId,
            @PathVariable Long discountId,
            @RequestParam boolean active
    );

    @Operation(
            summary = "Brand: 상품 할인 삭제",
            description = "지정한 상품 할인 엔트리를 삭제합니다."
    )
    @DeleteMapping(value = {"/brand/product/{discountId}", "/brand/discounts/product/{discountId}"})
    ResponseEntity<ApiResponse<Void>> deleteProduct(
            @AuthUser String userId,
            @PathVariable Long discountId
    );

    @Operation(
            summary = "Brand: 내가 만든 상품 할인 목록",
            description = "옵션 productId로 필터링 가능. 생성 내림차순 페이지."
    )
    @GetMapping(value = {"/brand/product/mine", "/brand/discounts/product/mine"})
    ResponseEntity<ApiResponse<Page<ProductDiscountDtos.ProductDiscountResponse>>> mine(
            @AuthUser String userId,
            @RequestParam(required = false) Long productId,
            Pageable pageable
    );

    @Operation(
            summary = "Brand: 현재 유효 할인 요약",
            description = "상품별 ‘현재 진행 중’ 최대 퍼센트를 기준으로 요약 페이지 반환."
    )
    @GetMapping(value = {"/brand/product/mine/active/summary", "/brand/discounts/product/mine/active/summary"})
    ResponseEntity<ApiResponse<Page<ProductDiscountDtos.ActiveSummaryResponse>>> activeSummary(
            @AuthUser String userId,
            Pageable pageable
    );

    @Operation(
            summary = "서버 파이프라인: 현재 유효 퍼센트",
            description = "특정 상품의 현재 유효한 최대 퍼센트 반환."
    )
    @GetMapping(value = {"/product/active-percent/{productId}", "/brand/discounts/product/active-percent/{productId}"})
    ResponseEntity<ApiResponse<Integer>> activePercent(@PathVariable Long productId);

    @Operation(
            summary = "공개 가격(단건)",
            description = "원가/상품할인%/할인금액/할인가를 반환합니다. (ON_SALE 상품만)"
    )
    @GetMapping(value = {"/products/{productId}/price", "/products/price/{productId}"})
    ResponseEntity<ApiResponse<ProductDiscountDtos.PublicPriceView>> publicPrice(@PathVariable Long productId);

    @Operation(
            summary = "공개 가격(배치)",
            description = "ids=1,2,3 형태로 여러 상품의 공개 가격을 일괄 반환합니다."
    )
    @GetMapping("/products/prices")
    ResponseEntity<ApiResponse<List<ProductDiscountDtos.PublicPriceView>>> publicPrices(@RequestParam List<Long> ids);

    /* ================= UserDiscount (브랜드 전용) ================= */

    @Operation(
            summary = "Brand: 개인할인(브랜드 전상품) 생성/업서트",
            description = "특정 유저에게 본인 브랜드의 전상품에 대해 extraPercent를 부여합니다."
    )
    @PostMapping("/brand/user")
    ResponseEntity<ApiResponse<Long>> upsertForBrand(
            @AuthUser String authUserId,
            @RequestBody CreateUserDiscountRequest req
    );

    @Operation(
            summary = "Brand: 개인할인(특정 상품) 생성/업서트",
            description = "특정 유저에게 특정 상품에 대해 extraPercent를 부여합니다."
    )
    @PostMapping("/brand/user/product")
    ResponseEntity<ApiResponse<Long>> upsertForProduct(
            @AuthUser String authUserId,
            @RequestBody CreateUserDiscountRequest req
    );

    @Operation(
            summary = "Brand: 내가 만든 개인할인 전체 목록",
            description = "브랜드/상품 스코프 모두 포함. targetUserNumber, productId, onlyActiveNow로 필터 가능."
    )
    @GetMapping("/brand/user/mine")
    ResponseEntity<ApiResponse<Page<UserDiscountDtos.UserDiscountResponse>>> listMyUserDiscounts(
            @AuthUser String authUserId,
            @RequestParam(required = false) Long targetUserNumber,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false, defaultValue = "false") boolean onlyActiveNow,
            Pageable pageable
    );

    @Operation(
            summary = "Brand: 개인할인 부분 수정",
            description = "extraPercent/기간/활성 중 일부를 수정합니다. (스코프는 변경하지 않음)"
    )
    @PatchMapping("/brand/user/{discountId}")
    ResponseEntity<ApiResponse<UserDiscountDtos.UserDiscountResponse>> updateUserDiscount(
            @AuthUser String authUserId,
            @PathVariable Long discountId,
            @Valid @RequestBody UpdateUserDiscountRequest req
    );

    @Operation(
            summary = "Brand: 개인할인 활성/비활성",
            description = "개인할인의 active 값을 토글합니다."
    )
    @PatchMapping("/brand/user/{discountId}/active")
    ResponseEntity<ApiResponse<Void>> setActiveUserDiscount(
            @AuthUser String authUserId,
            @PathVariable Long discountId,
            @RequestParam boolean active
    );

    @Operation(
            summary = "Brand: 개인할인 삭제",
            description = "개인할인 엔트리를 삭제합니다."
    )
    @DeleteMapping("/brand/user/{discountId}")
    ResponseEntity<ApiResponse<Void>> deleteUserDiscount(
            @AuthUser String authUserId,
            @PathVariable Long discountId
    );
}
