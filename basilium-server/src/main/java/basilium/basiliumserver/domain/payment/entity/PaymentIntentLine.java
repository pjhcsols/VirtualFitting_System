// src/main/java/basilium/basiliumserver/domain/payment/entity/PaymentIntentLine.java
package basilium.basiliumserver.domain.payment.entity;

import basilium.basiliumserver.domain.product.entity.Product;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.BatchSize;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(
        name = "payment_intent_line",
        indexes = {
                @Index(name = "idx_pil_payment_status", columnList = "payment_id,status"),
                @Index(name = "idx_pil_product", columnList = "product_id"),
                @Index(name = "idx_pil_reserve_task", columnList = "reserve_task_id")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@BatchSize(size = 200)
public class PaymentIntentLine {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 상위 결제(주문) */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    /** 스냅샷: 상품/옵션/수량 */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(length = 20, nullable = false)
    private String size;

    @Column(length = 20, nullable = false)
    private String color;

    @Column(name = "qty", nullable = false)
    private Long quantity;

    /** 가격 스냅샷(서버 기준: 상품할인까지만) */
    @Column(name = "unit_after_brand", nullable = false)
    private Long unitPriceAfterBrandDiscount;   // 단가(브랜드 할인 반영)

    @Column(name = "line_base", nullable = false)
    private Long lineBase;                       // unitAfterBrand * qty

    /** 쿠폰 스냅샷(선택) */
    @Column(name = "coupon_wallet_id")
    private Long couponWalletId;

    @Column(name = "coupon_discount", nullable = false)
    private Long couponDiscount;

    @Column(name = "line_after_coupon", nullable = false)
    private Long lineAfterCoupon;

    /** 포인트 배분 계획 & 최종 결제 라인 금액 */
    @Column(name = "alloc_point", nullable = false)
    private Long plannedAllocatedPoint;          // 라인에 배분할 포인트(옵션)

    @Column(name = "final_line_payable", nullable = false)
    private Long finalLinePayable;

    /** 재고 예약 식별자(옵션) */
    @Column(name = "reserve_task_id", columnDefinition = "BINARY(16)")
    private UUID reserveTaskId; // 어차피 reserveTaskOrderPayId로 통합되어서 낱개별로 필요없다. 지우기 어차피 payment에 있음

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private PaymentStatus status; // INIT/APPROVED/CANCELLED/EXPIRED

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime approvedAt;

    private PaymentIntentLine(Payment payment,
                              Product product,
                              String size,
                              String color,
                              long quantity,
                              long unitAfterBrand,
                              long lineBase,
                              Long couponWalletId,
                              long couponDiscount,
                              long lineAfterCoupon,
                              UUID reserveTaskId) {

        this.payment = Objects.requireNonNull(payment);
        this.product = Objects.requireNonNull(product);
        this.size = Objects.requireNonNull(size);
        this.color = Objects.requireNonNull(color);
        if (quantity <= 0) throw new IllegalArgumentException("quantity > 0");
        this.quantity = quantity;

        this.unitPriceAfterBrandDiscount = Math.max(0L, unitAfterBrand);
        this.lineBase = Math.max(0L, lineBase);
        this.couponWalletId = couponWalletId;
        this.couponDiscount = Math.max(0L, couponDiscount);
        this.lineAfterCoupon = Math.max(0L, lineAfterCoupon);

        this.plannedAllocatedPoint = 0L;
        this.finalLinePayable = this.lineAfterCoupon;

        this.reserveTaskId = reserveTaskId;
        this.status = PaymentStatus.INIT;
        this.createdAt = LocalDateTime.now();
    }

    public static PaymentIntentLine initLine(Payment payment,
                                             Product product,
                                             String size,
                                             String color,
                                             long quantity,
                                             long unitAfterBrand,
                                             long lineBase,
                                             Long couponWalletId,
                                             long couponDiscount,
                                             long lineAfterCoupon,
                                             UUID reserveTaskId) {
        return new PaymentIntentLine(payment, product, size, color, quantity,
                unitAfterBrand, lineBase, couponWalletId, couponDiscount, lineAfterCoupon, reserveTaskId);
    }

    public void allocatePoint(long alloc) {
        if (alloc < 0) throw new IllegalArgumentException("alloc >= 0");
        this.plannedAllocatedPoint = alloc;
    }

    public void approve(long finalPay, LocalDateTime now) {
        if (finalPay < 0) throw new IllegalArgumentException("finalPay >= 0");
        this.finalLinePayable = finalPay;
        this.status = PaymentStatus.APPROVED;
        this.approvedAt = now;
    }

    public void cancelInit() { this.status = PaymentStatus.CANCELLED; }

    public void expireIntent() { this.status = PaymentStatus.EXPIRED; }
}
