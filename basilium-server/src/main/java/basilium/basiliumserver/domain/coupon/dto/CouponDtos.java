// src/main/java/basilium/basiliumserver/domain/coupon/dto/CouponDtos.java
package basilium.basiliumserver.domain.coupon.dto;

import basilium.basiliumserver.domain.coupon.entity.BrandCouponCampaignStatus;
import basilium.basiliumserver.domain.coupon.entity.BrandCouponScope;
import lombok.*;

import java.time.LocalDateTime;

public final class CouponDtos {

    /* ========== Campaign ========== */

    /* 생성 요청 */
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CampaignCreateRequest {
        private BrandCouponScope scope;      // BRAND | PRODUCT
        private Long productId;              // scope=PRODUCT 필수
        private Integer percent;             // 1~90
        private Long minOrderPrice;          // null 가능(제한 없음)
        private Long maxDiscountPrice;       // null 가능(상한 없음)
        private LocalDateTime startAt;
        private LocalDateTime endAt;
        private Integer perUserLimit;        // 기본 1
        private Long totalIssuable;          // 0이면 무제한 의미로 사용 가능 (정책에 따라)
    }

    /* 수정 요청 */
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CampaignUpdateRequest {
        private BrandCouponScope scope;
        private Long productId;
        private Integer percent;
        private Long minOrderPrice;
        private Long maxDiscountPrice;
        private LocalDateTime startAt;
        private LocalDateTime endAt;
        private Integer perUserLimit;
        private Long totalIssuable;
    }

    /* 조회 응답 */
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CampaignResponse {
        private Long id;
        private Long brandUserNumber;
        private BrandCouponScope scope;
        private Long productId;
        private Integer percent;
        private Long minOrderPrice;
        private Long maxDiscountPrice;
        private LocalDateTime startAt;
        private LocalDateTime endAt;
        private Integer perUserLimit;
        private Long totalIssuable;
        private Long issuedCount;
        private BrandCouponCampaignStatus status;
        private LocalDateTime createdAt;
    }

    /* ========== Wallet ========== */

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class WalletClaimRequest {
        private Long campaignId;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class WalletClaimResponse {
        private Long walletId;
        private Long campaignId;
        private Integer percent;
        private Long maxDiscountPrice;
    }

    /* ========== 상품 상세 노출용(다운 버튼 영역) ========== */

    @Getter
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    public static class ClaimableOnProductView {
        private final Long campaignId;
        private final BrandCouponScope scope;
        private final Integer percent;
        private final Long maxDiscountPrice;
        private final Long minOrderPrice;
        //estimatedDiscountOnThisProduct = (상품 “할인후 단가”) × (쿠폰 %) 에 상한(maxDiscountPrice)
        private final Long estimatedDiscountOnThisProduct; // 상품 1개 기준 미리보기 (쿠폰으로 깎이는 예상 금액 계산)
        private final LocalDateTime endAt;

        private final boolean alreadyClaimed;
        private final int remainingCanClaim;

        private final long ownedCount;        // AVAILABLE + USED
        private final long availableCount;    // AVAILABLE
        private final long usedCount;         // USED
        private final boolean hasAvailable;   // derived: availableCount > 0
        private final boolean alreadyUsedOnce; // derived: usedCount > 0

        /** 안전한 생성 팩토리: 파생 필드는 여기서 계산 */
        public static ClaimableOnProductView of(
                Long campaignId,
                BrandCouponScope scope,
                Integer percent,
                Long maxDiscountPrice,
                Long minOrderPrice,
                Long estimatedDiscountOnThisProduct,
                LocalDateTime endAt,
                boolean alreadyClaimed,
                int remainingCanClaim,
                long ownedCount,
                long availableCount,
                long usedCount
        ) {
            final boolean hasAvailable = availableCount > 0;
            final boolean alreadyUsedOnce = usedCount > 0;
            return new ClaimableOnProductView(
                    campaignId, scope, percent, maxDiscountPrice, minOrderPrice,
                    estimatedDiscountOnThisProduct, endAt,
                    alreadyClaimed, remainingCanClaim,
                    ownedCount, availableCount, usedCount,
                    hasAvailable, alreadyUsedOnce
            );
        }
    }

    /* ========== 체크아웃 옵션(결제창) ========== */

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CheckoutCouponOption {
        private Long walletId;
        private Long campaignId;
        private BrandCouponScope scope;
        private Integer percent;
        private Long maxDiscountPrice;
        private Long minOrderPrice;
        private Long eligibleBase;     // 쿠폰 적용 대상 합계(브랜드/상품 범위)
        private Long discountAmount;   // min(round(eligibleBase*percent/100), maxDiscountPrice)
        private boolean applicableNow; // minOrderPrice 충족 여부
        private String label;          // 프런트 라벨
    }
}
