// src/main/java/basilium/basiliumserver/domain/coupon/controller/apiDocs/CouponApiDocs.java
package basilium.basiliumserver.domain.coupon.controller.apiDocs;

import basilium.basiliumserver.domain.coupon.dto.CouponDtos.CampaignCreateRequest;
import basilium.basiliumserver.domain.coupon.dto.CouponDtos.CampaignResponse;
import basilium.basiliumserver.domain.coupon.dto.CouponDtos.CampaignUpdateRequest;
import basilium.basiliumserver.domain.coupon.dto.CouponDtos.ClaimableOnProductView;
import basilium.basiliumserver.domain.coupon.dto.CouponDtos.WalletClaimRequest;
import basilium.basiliumserver.domain.coupon.dto.CouponDtos.WalletClaimResponse;
import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.auth.support.AuthUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Coupon API 문서 인터페이스
 * - 컨트롤러(CouponController)와 동일한 시그니처 + Swagger/OpenAPI 메타 제공
 */
@Tag(name = "쿠폰", description = "브랜드 쿠폰 발급 캠페인(BrandCouponCampaign)과 일반 유저 지갑 쿠폰(NormalCouponWallet) 발급/조회 API")
@RequestMapping("/b1/coupons")
public interface CouponApiDocs {

    /* ================= 브랜드 캠페인 관리 ================= */

    @Operation(
            summary = "Brand: 내가 만든 캠페인 목록(페이지)",
            description = """
                    브랜드 소유자의 캠페인을 생성일 내림차순으로 페이지 조회합니다.
                    상태(SCHEDULED/ACTIVE/EXPIRED)와 기간 정보가 포함됩니다.
                    - 인증: ROLE_BRAND + 본인 계정
                    - 정렬 기본: createdAt DESC
                    """
    )
    @GetMapping("/brands/me/campaigns")
    ResponseEntity<ApiResponse<Page<CampaignResponse>>> myCampaigns(
            @Parameter(description = "인증 사용자 ID(브랜드 계정). SecurityContext에서 주입됩니다.", required = true)
            @AuthUser String authUserId,
            @ParameterObject Pageable pageable
    );

    @Operation(
            summary = "Brand: 캠페인 생성",
            description = """
                    브랜드/상품 한정 쿠폰 캠페인을 생성합니다.
                    - scope=BRAND 인 경우 productId는 무시됩니다.
                    - scope=PRODUCT 인 경우 productId는 필수이며, 소유 상품만 지정할 수 있습니다.
                    - percent(1~90), minOrderPrice/maxDiscountPrice는 제약/상한으로 동작합니다.
                    - startAt < endAt 이어야 하며, 상태는 자동으로 SCHEDULED/ACTIVE 중 하나로 설정됩니다.
                    """
    )
    @PostMapping("/brands/me/campaigns")
    ResponseEntity<ApiResponse<CampaignResponse>> create(
            @Parameter(description = "인증 사용자 ID(브랜드 계정). SecurityContext에서 주입됩니다.", required = true)
            @AuthUser String authUserId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(schema = @Schema(implementation = CampaignCreateRequest.class))
            )
            @Valid @RequestBody CampaignCreateRequest req
    );

    @Operation(
            summary = "Brand: 캠페인 부분 수정",
            description = """
                    기존 캠페인의 일부 필드를 수정합니다(퍼센트/기간/범위/상한/최소주문/발급한도 등).
                    변경 후 현재 시각 기준으로 상태(SCHEDULED/ACTIVE/EXPIRED)를 재산출합니다.
                    - scope=BRAND 로 바꾸는 경우 product는 자동으로 null 처리됩니다.
                    - scope=PRODUCT 로 설정 시 productId는 본인 소유 상품이어야 합니다.
                    """
    )
    @PatchMapping("/brands/me/campaigns/{id}")
    ResponseEntity<ApiResponse<CampaignResponse>> update(
            @Parameter(description = "인증 사용자 ID(브랜드 계정). SecurityContext에서 주입됩니다.", required = true)
            @AuthUser String authUserId,
            @Parameter(description = "수정할 캠페인 ID", required = true)
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(schema = @Schema(implementation = CampaignUpdateRequest.class))
            )
            @Valid @RequestBody CampaignUpdateRequest req
    );

    /* ================ 상품 상세: 발급 가능 조회 & 발급 ================ */

    @Operation(
            summary = "상품 상세: 발급 가능 캠페인 목록",
            description = """
                    특정 상품 상세 화면에서, 현재 시각에 발급/사용 가능한 브랜드/상품 범위의 쿠폰 캠페인을 조회합니다.
                    - 인증 불필요(게스트 가능).
                    - normalUserId를 제공하면 '이미 발급했는지/유저별 발급 잔여' 등 개인화 정보를 포함합니다.
                    - 기준 단가: 상품할인(ProductDiscount) 적용 후 단가.
                    - 브랜드 범위와 상품 한정이 동시에 존재하면 둘 다 노출됩니다.
                    """
    )
    @GetMapping("/products/{productId}/claimables")
    ResponseEntity<ApiResponse<List<ClaimableOnProductView>>> claimablesOnProduct(
            @Parameter(description = "조회 대상 상품 ID", required = true, example = "1001")
            @PathVariable Long productId,
            @Parameter(
                    description = "로그인한 일반 사용자 ID. 미인증/게스트 호출 시 생략(또는 null). 제공 시 개인화 정보 포함.",
                    required = false,
                    example = "hansol_user"
            )
            @Nullable @RequestParam(required = false) String normalUserId
    );

    @Operation(
            summary = "상품 상세: 쿠폰 다운(발급) → 지갑 생성",
            description = """
                    상세 페이지의 '다운' 액션으로 해당 캠페인 쿠폰을 사용자 지갑에 발급합니다.
                    - 인증: ROLE_NORMAL + 본인 계정
                    - 요청 본문: { "campaignId": number }
                    - 진행중(STATUS=ACTIVE) + 기간 내(startAt<=now<=endAt) 캠페인만 발급됩니다.
                    - perUserLimit 및 totalIssuable 한도를 동시에 검사합니다.
                    - 동시성은 issuedCount 낙관적 잠금으로 제어합니다.
                    """
    )
    @PostMapping("/wallets")
    ResponseEntity<ApiResponse<WalletClaimResponse>> claim(
            @Parameter(description = "인증 사용자 ID(일반 유저). SecurityContext에서 주입됩니다.", required = true)
            @AuthUser String authUserId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(schema = @Schema(implementation = WalletClaimRequest.class))
            )
            @RequestBody WalletClaimRequest req
    );
}
