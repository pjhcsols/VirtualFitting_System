// src/main/java/basilium/basiliumserver/domain/order/entity/Order.java
package basilium.basiliumserver.domain.order.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(
        name = "orders",
        indexes = {
                @Index(name = "idx_orders_user", columnList = "user_number"),
                @Index(name = "idx_orders_status_created", columnList = "status,created_at")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order {

    @Id
    @Column(name = "order_id", length = 64, nullable = false, unique = true)
    private String orderId;

    @Column(name = "user_number", nullable = false)
    private Long userNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private OrderStatus status;

    // 합계 4종
    @Column(name = "original_amount", nullable = false)
    private Long originalAmount;
    @Column(name = "brand_discount_amount", nullable = false)
    private Long brandDiscountAmount;
    @Column(name = "user_extra_discount_amount", nullable = false)
    private Long userExtraDiscountAmount;
    @Column(name = "final_pay_amount", nullable = false)
    private Long finalPayAmount;

    // 사용 요약
    @Column(name = "coupon_used_amount", nullable = false)
    private Long couponUsedAmount;
    @Column(name = "wallet_used_amount", nullable = false)
    private Long walletUsedAmount;

    // 배송지
    @Column(name = "recipient_name", length = 50)  private String recipientName;
    @Column(name = "recipient_phone", length = 20) private String recipientPhone;
    @Column(name = "zip_code", length = 12)        private String zipCode;
    @Column(name = "addr1", length = 200)          private String addr1;
    @Column(name = "addr2", length = 200)          private String addr2;
    @Column(name = "shipping_memo", length = 200)  private String shippingMemo;

    // 택배
    @Column(name = "courier_code", length = 20)  private String courierCode;
    @Column(name = "courier_name", length = 50)  private String courierName;
    @Column(name = "tracking_no", length = 64)   private String trackingNo;

    // 타임스탬프
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "paid_at")       private LocalDateTime paidAt;
    @Column(name = "delivered_at")  private LocalDateTime deliveredAt;
    @Column(name = "confirmed_at")  private LocalDateTime confirmedAt;
    @Column(name = "updated_at")    private LocalDateTime updatedAt;

    private Order(String orderId, Long userNumber,
                  long originalAmount, long brandDiscountAmount, long userExtraDiscountAmount, long finalPayAmount,
                  long couponUsedAmount, long walletUsedAmount, LocalDateTime paidAt) {
        this.orderId = Objects.requireNonNull(orderId);
        this.userNumber = Objects.requireNonNull(userNumber);
        this.originalAmount = Math.max(0L, originalAmount);
        this.brandDiscountAmount = Math.max(0L, brandDiscountAmount);
        this.userExtraDiscountAmount = Math.max(0L, userExtraDiscountAmount);
        this.finalPayAmount = Math.max(0L, finalPayAmount);
        this.couponUsedAmount = Math.max(0L, couponUsedAmount);
        this.walletUsedAmount = Math.max(0L, walletUsedAmount);
        this.status = OrderStatus.PAID;
        this.paidAt = paidAt;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    public static Order paid(String orderId, Long userNumber,
                             long originalAmount, long brandDiscountAmount, long userExtraDiscountAmount, long finalPayAmount,
                             long couponUsedAmount, long walletUsedAmount, LocalDateTime paidAt) {
        return new Order(orderId, userNumber, originalAmount, brandDiscountAmount,
                userExtraDiscountAmount, finalPayAmount, couponUsedAmount, walletUsedAmount, paidAt);
    }

    // ===== 변경 메서드 =====
    public void updateShippingIfEditable(String name, String phone, String zip, String a1, String a2, String memo) {
        if (this.status == OrderStatus.IN_TRANSIT || this.status == OrderStatus.DELIVERED ||
                this.status == OrderStatus.PURCHASE_CONFIRMED) {
            throw new IllegalStateException("배송 진행 이후에는 주소 변경 불가");
        }
        this.recipientName = name;
        this.recipientPhone = phone;
        this.zipCode = zip;
        this.addr1 = a1;
        this.addr2 = a2;
        this.shippingMemo = memo;
        this.updatedAt = LocalDateTime.now();
    }

    public void toPreparingByBrand() {
        if (this.status != OrderStatus.PAID) throw new IllegalStateException("PAID → PREPARING 만 허용");
        this.status = OrderStatus.PREPARING;
        this.updatedAt = LocalDateTime.now();
    }

    public void toInTransitByBrand(String courierCode, String courierName, String trackingNo) {
        if (this.status != OrderStatus.PREPARING) throw new IllegalStateException("PREPARING → IN_TRANSIT 만 허용");
        this.status = OrderStatus.IN_TRANSIT;
        this.courierCode = courierCode;
        this.courierName = courierName;
        this.trackingNo = trackingNo;
        this.updatedAt = LocalDateTime.now();
    }

    public void toDeliveredByBrand(LocalDateTime now) {
        if (this.status != OrderStatus.IN_TRANSIT) throw new IllegalStateException("IN_TRANSIT → DELIVERED 만 허용");
        this.status = OrderStatus.DELIVERED;
        this.deliveredAt = now;
        this.updatedAt = now;
    }

    public boolean confirmByBuyer(LocalDateTime now) {
        if (this.status != OrderStatus.DELIVERED) throw new IllegalStateException("DELIVERED 에서만 구매확정 가능");
        this.status = OrderStatus.PURCHASE_CONFIRMED;
        this.confirmedAt = now;
        this.updatedAt = now;
        return true;
    }

    public void requestCancelByBuyer() {
        if (this.status != OrderStatus.PAID) throw new IllegalStateException("PAID 상태에서만 주문 취소 신청 가능");
        this.status = OrderStatus.CANCEL_REQUESTED;
        this.updatedAt = LocalDateTime.now();
    }

    public void adminSetStatus(OrderStatus to, LocalDateTime now) {
        this.status = to;
        if (to == OrderStatus.DELIVERED) this.deliveredAt = now;
        if (to == OrderStatus.PURCHASE_CONFIRMED) this.confirmedAt = now;
        this.updatedAt = now;
    }

    @PrePersist void prePersist() {
        this.createdAt = (this.createdAt == null ? LocalDateTime.now() : this.createdAt);
        this.updatedAt = (this.updatedAt == null ? this.createdAt : this.updatedAt);
    }
    @PreUpdate  void preUpdate() { this.updatedAt = LocalDateTime.now(); }
}
