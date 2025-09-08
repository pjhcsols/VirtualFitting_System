// src/main/java/basilium/basiliumserver/domain/payment/entity/Payment.java
package basilium.basiliumserver.domain.payment.entity;

import basilium.basiliumserver.domain.user.entity.NormalUser;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(
        name = "payment",
        indexes = {
                @Index(name = "idx_payment_order_id", columnList = "order_id", unique = true),
                @Index(name = "idx_payment_status", columnList = "status"),
                @Index(name = "idx_payment_payment_key", columnList = "payment_key")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Payment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 주문 상관 키 — 예약 단계에서 발급(프론트/서버 공통 식별자) */
    @Column(name = "order_id", length = 64, nullable = false, unique = true)
    private String orderId; //reserveTaskOrderPayId 로 리팩토링

    /** 소유자 */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "normal_user_number", nullable = false)
    private NormalUser normalUser;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private PaymentStatus status; // INIT/APPROVED/CANCELLED/FAILED/EXPIRED/REFUNDED

    /** 통화 (ex. KRW) */
    @Column(length = 10, nullable = false)
    private String currency;

    /** 의도 만료 시각 — 재고 예약 TTL과 동일하게 세팅 */
    @Column(name = "intent_expires_at")
    private LocalDateTime intentExpiresAt;

    /** 포인트 사용 예정액(승인 성공 시 Wallet DEBIT) */
    @Column(name = "points_to_use", nullable = false)
    private Long pointsToUse;

    /** 승인 금액(= 모든 라인의 finalLinePayable 합계) */
    @Column(nullable = false)
    private Long amount;

    /** 환불 누계(집계 칼럼) */
    @Column(name = "refunded_total", nullable = false)
    private Long refundedAmountTotal;

    @Column(name = "payment_key", length = 64)
    private String paymentKey;

    @Column(length = 20)
    private String paymentType;

    /** PG 실패 코드/메시지(실패 콜백용) */
    @Column(name = "pg_error_code", length = 64)
    private String pgErrorCode;

    @Column(name = "pg_error_message", length = 256)
    private String pgErrorMessage;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
    private LocalDateTime callbackReceivedAt;

    /** 기존 아임포트 호환 필드(선택) */
    @Column(name = "imp_u_id", length = 64)
    private String impUId;

    private Payment(String orderId, NormalUser user, String currency,
                    long pointsToUse, long amountToPay, LocalDateTime expiresAt) {
        this.orderId = Objects.requireNonNull(orderId);
        this.normalUser = Objects.requireNonNull(user);
        this.currency = Objects.requireNonNull(currency);
        if (pointsToUse < 0) throw new IllegalArgumentException("pointsToUse >= 0");
        if (amountToPay < 0) throw new IllegalArgumentException("amountToPay >= 0");
        this.pointsToUse = pointsToUse;
        this.amount = amountToPay; // 의도 시점 서버 계산 금액(승인 시 재검증/조정 가능)
        this.status = PaymentStatus.INIT;
        this.intentExpiresAt = expiresAt;
        this.refundedAmountTotal = 0L;
        this.createdAt = LocalDateTime.now();
    }

    public static Payment initIntent(String orderId, NormalUser user, String currency,
                                     long pointsToUse, long amountToPay, LocalDateTime expiresAt) {
        return new Payment(orderId, user, currency, pointsToUse, amountToPay, expiresAt);
    }

    public boolean ownedBy(Long userNumber) { return Objects.equals(this.normalUser.getUserNumber(), userNumber); }

    public void approve(String paymentKey, String paymentType, long finalApprovedAmount, LocalDateTime now) {
        if (finalApprovedAmount < 0) throw new IllegalArgumentException("finalApprovedAmount >= 0");
        this.status = PaymentStatus.APPROVED;
        this.paymentKey = Objects.requireNonNull(paymentKey);
        this.paymentType = Objects.requireNonNull(paymentType);
        this.amount = finalApprovedAmount;
        this.approvedAt = now;
        this.callbackReceivedAt = now;
        this.pgErrorCode = null;
        this.pgErrorMessage = null;
    }

    public void cancelInit() {
        this.status = PaymentStatus.CANCELLED;
        this.callbackReceivedAt = LocalDateTime.now();
    }

    public void failInit(String code, String message) {
        this.status = PaymentStatus.FAILED;
        this.pgErrorCode = code;
        this.pgErrorMessage = message;
        this.callbackReceivedAt = LocalDateTime.now();
    }

    public void expireIntent() { this.status = PaymentStatus.EXPIRED; }

    public void applyRefund(long refundAmount) {
        if (refundAmount <= 0) throw new IllegalArgumentException("refundAmount > 0");
        this.refundedAmountTotal = this.refundedAmountTotal + refundAmount;
        if (this.amount > 0 && this.refundedAmountTotal >= this.amount) {
            this.status = PaymentStatus.REFUNDED;
        }
    }
}
