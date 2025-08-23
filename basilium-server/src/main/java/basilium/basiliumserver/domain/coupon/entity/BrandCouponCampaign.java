// src/main/java/basilium/basiliumserver/domain/coupon/entity/BrandCouponCampaign.java
package basilium.basiliumserver.domain.coupon.entity;

import basilium.basiliumserver.domain.product.entity.Product;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Objects;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "brand_coupon_campaign",
        indexes = {
                @Index(name = "idx_bcc_brand_status_time", columnList = "brand_user_number,status,start_at,end_at"),
                @Index(name = "idx_bcc_product", columnList = "product_id")
        }
)
public class BrandCouponCampaign {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 소유 브랜드(조인 없이 필터) */
    @Column(name = "brand_user_number", nullable = false)
    private Long brandUserNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private BrandCouponScope scope; // BRAND | PRODUCT

    /** scope=PRODUCT 일 때만 설정 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    /** 할인율(%) 1~90 */
    @Column(nullable = false)
    private Integer percent;

    /** 최소 주문 금액(서버 기준: 상품할인까지 반영 합계) — null이면 제한 없음 */
    @Column(name = "min_order")
    private Long minOrderPrice;

    /** 최대 할인 금액(상한) — null이면 제한 없음 */
    @Column(name = "max_discount")
    private Long maxDiscountPrice;

    /** 캠페인 기간 */
    @Column(name = "start_at", nullable = false)
    private LocalDateTime startAt;

    @Column(name = "end_at", nullable = false)
    private LocalDateTime endAt;

    /** 1인당 발급 제한 & 전체 발급 가능 매수 */
    @Column(name = "per_user_limit", nullable = false)
    private Integer perUserLimit;

    @Column(name = "total_issuable", nullable = false)
    private Long totalIssuable;

    @Column(name = "issued_count", nullable = false)
    private Long issuedCount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private BrandCouponCampaignStatus status; // SCHEDULED/ACTIVE/EXPIRED

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** 낙관잠금(issuedCount 업데이트 경합 제어) */
    @Version
    private Long version;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (perUserLimit == null || perUserLimit <= 0) perUserLimit = 1;
        if (totalIssuable == null || totalIssuable < 0) totalIssuable = 0L;
        if (issuedCount == null) issuedCount = 0L;
        if (status == null) status = computeStatus(LocalDateTime.now());
        if (scope == BrandCouponScope.BRAND) product = null; // 브랜드 범위면 product 강제 해제
    }

    public boolean isActiveNow(LocalDateTime now) {
        return status == BrandCouponCampaignStatus.ACTIVE
                && !now.isBefore(startAt)
                && !now.isAfter(endAt);
    }

    public void increaseIssued() {
        if (issuedCount + 1 > totalIssuable) throw new IllegalStateException("발급 한도 초과");
        issuedCount = issuedCount + 1;
    }

    public BrandCouponCampaignStatus computeStatus(LocalDateTime now) {
        if (now.isBefore(startAt)) return BrandCouponCampaignStatus.SCHEDULED;
        if (now.isAfter(endAt)) return BrandCouponCampaignStatus.EXPIRED;
        return BrandCouponCampaignStatus.ACTIVE;
    }

    public void recomputeStatus(LocalDateTime now) {
        status = computeStatus(now);
    }

    /* 캠페인 정책/기간 수정(브랜드 본인만), 변경 후 상태 재계산 */
    public void changeFields(
            Integer percentParam,
            Long minOrderPriceParam,
            Long maxDiscountPriceParam,
            BrandCouponScope scopeParam,
            Product productParam,
            Integer perUserLimitParam,
            Long totalIssuableParam,
            LocalDateTime startAtParam,
            LocalDateTime endAtParam,
            LocalDateTime now
    ) {
        if (percentParam != null) percent = percentParam;
        if (minOrderPriceParam != null) minOrderPrice = minOrderPriceParam;
        if (maxDiscountPriceParam != null) maxDiscountPrice = maxDiscountPriceParam;
        if (scopeParam != null) scope = scopeParam;
        if (Objects.equals(scope, BrandCouponScope.BRAND)) product = null;
        if (Objects.equals(scope, BrandCouponScope.PRODUCT) && productParam != null) product = productParam;
        if (perUserLimitParam != null) perUserLimit = perUserLimitParam;
        if (totalIssuableParam != null) totalIssuable = totalIssuableParam;
        if (startAtParam != null) startAt = startAtParam;
        if (endAtParam != null) endAt = endAtParam;
        recomputeStatus(now);
    }
}
