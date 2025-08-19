package basilium.basiliumserver.domain.discount.entity;

import basilium.basiliumserver.domain.product.entity.Product;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Objects;

//브랜드 유저가 특정 상품을 대상으로 할인
@Getter
@AllArgsConstructor
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(
        name = "product_discount",
        indexes = {
                @Index(name = "idx_pd_product", columnList = "product_id"),
                @Index(name = "idx_pd_brand_user", columnList = "brand_user_number"),
                @Index(name = "idx_pd_active_period", columnList = "active,start_at,end_at")
        }
)
public class ProductDiscount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_discount_id")
    private Long id;

    /** 조회/조인 성능을 위한 중복 보관 (브랜드 소유 확인 및 인덱스) */
    @Column(name = "brand_user_number", nullable = false)
    private Long brandUserNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    /** 0~90 (%) - 소스 필드 */
    @Column(nullable = false)
    private Integer percent;

    /** 원가 기준 할인 금액(자동 계산, 직접 입력/수정 금지) */
    @Column(name = "discount_amount", nullable = false)
    private Long discountAmount;

    /** 할인가(자동 계산, 직접 입력/수정 금지) = base - discountAmount */
    @Column(name = "discounted_unit_price", nullable = false)
    private Long discountedUnitPrice;

    @Column(nullable = false)
    private Boolean active;

    @Column(name = "start_at", nullable = false)
    private LocalDateTime startAt;

    @Column(name = "end_at", nullable = false)
    private LocalDateTime endAt;

    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (active == null) active = Boolean.TRUE;
    }

    /* ---------- 정적 팩토리 ---------- */

    public static ProductDiscount createByPercent(
            Long brandUserNumber,
            Product product,
            int percent,
            LocalDateTime startAt,
            LocalDateTime endAt,
            boolean active
    ) {
        ProductDiscount pd = new ProductDiscount();
        pd.brandUserNumber = requireNonNull(brandUserNumber, "brandUserNumber");
        pd.product = requireNonNull(product, "product");
        pd.active = active;
        pd.startAt = requireNonNull(startAt, "startAt");
        pd.endAt = requireNonNull(endAt, "endAt");
        pd.applyByPercent(percent);
        return pd;
    }

    public static ProductDiscount createByAmount(
            Long brandUserNumber,
            Product product,
            long amount,
            LocalDateTime startAt,
            LocalDateTime endAt,
            boolean active
    ) {
        ProductDiscount pd = new ProductDiscount();
        pd.brandUserNumber = requireNonNull(brandUserNumber, "brandUserNumber");
        pd.product = requireNonNull(product, "product");
        pd.active = active;
        pd.startAt = requireNonNull(startAt, "startAt");
        pd.endAt = requireNonNull(endAt, "endAt");
        pd.applyByAmount(amount);
        return pd;
    }

    /* ---------- 도메인 변경 메서드(더티체킹) ---------- */

    /** 퍼센트로 변경 → 금액/할인가 자동 환산 */
    public void changePercent(Integer newPercent) {
        if (newPercent == null) return; // null 금지 방침: 호출측에서 Optional로 제어
        applyByPercent(newPercent);
    }

    /** 금액으로 변경 → 퍼센트/할인가 자동 환산 */
    public void changeAmount(Long newAmount) {
        if (newAmount == null) return;
        applyByAmount(newAmount);
    }

    public void changePeriod(LocalDateTime startAt, LocalDateTime endAt) {
        if (startAt != null) this.startAt = startAt;
        if (endAt != null) this.endAt = endAt;
    }

    public void changeActive(Boolean active) {
        if (active != null) this.active = active;
    }

    /* ---------- 내부 계산 ---------- */

    private void applyByPercent(int percent) {
        validatePercent(percent);
        long base = requireNonNull(product.getProductPrice(), "product.productPrice");
        long amount = calcAmount(base, percent);
        applyResolved(percent, amount, base);
    }

    private void applyByAmount(long amount) {
        long base = requireNonNull(product.getProductPrice(), "product.productPrice");
        validateAmount(amount, base);
        int percent = calcPercent(amount, base);
        validatePercent(percent);
        applyResolved(percent, amount, base);
    }

    private void applyResolved(int percent, long amount, long base) {
        this.percent = percent;
        this.discountAmount = amount;
        this.discountedUnitPrice = Math.max(0L, base - amount);
    }

    private static void validatePercent(int percent) {
        if (percent < 0 || percent > 90) throw new IllegalArgumentException("percent must be 0~90");
    }

    private static void validateAmount(long amount, long base) {
        if (amount < 0) throw new IllegalArgumentException("discount amount must be >= 0");
        long max = calcAmount(base, 90);
        if (amount > max) throw new IllegalArgumentException("discount amount exceeds 90% of base");
    }

    private static long calcAmount(long base, int percent) {
        if (base <= 0 || percent <= 0) return 0L;
        return BigDecimal.valueOf(base)
                .multiply(BigDecimal.valueOf(percent).divide(BigDecimal.valueOf(100)))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();
    }

    private static int calcPercent(long amount, long base) {
        if (base <= 0 || amount <= 0) return 0;
        return BigDecimal.valueOf(amount).multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(base), 0, RoundingMode.HALF_UP)
                .intValueExact();
    }

    private static <T> T requireNonNull(T v, String name) {
        return Objects.requireNonNull(v, () -> name + " is required");
    }
}
