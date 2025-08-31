package basilium.basiliumserver.domain.payment.entity;

import basilium.basiliumserver.domain.product.entity.Product;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payment",
        indexes = {
                @Index(name = "idx_payment_order_id",    columnList = "order_id"),     // ✅ snake_case
                @Index(name = "idx_payment_status",      columnList = "status"),
                @Index(name = "idx_payment_payment_key", columnList = "payment_key")   // ✅ snake_case
        })
@Getter
@Setter
public class Payment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* ===== 재고/결제 공통 상관 키 ===== */
    @Column(name = "order_id", length = 64)   // ✅ 물리 컬럼명 명시
    private String orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)            // ✅ FK 컬럼명 고정
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "normal_user_number", nullable = false)    // ✅ FK 컬럼명 고정
    private NormalUser normalUser;

    @Column(length = 20)
    private String size;             // 옵션 - 재고 파트에서 사용
    @Column(length = 20)
    private String color;            // 옵션 - 재고 파트에서 사용
    private Long totalCnt;           // 수량   - 재고 파트에서 사용

    /* ===== PG/거래 필드(지갑이 참조하는 최소 필드 포함) ===== */
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;    // APPROVED, FAILED, ...

    private Long amount;             // **라인 최종 결제금액**(지갑 10% 적립 등에서 사용)
    private Long refundedAmountTotal; // 환불 누계(정산/적립 계산 시 순액 판단용)

    @Column(name = "payment_key", length = 64) // ✅ 물리 컬럼명 명시 pg 키
    private String paymentKey;
    @Column(length = 20)
    private String paymentType;      // CARD 등
    @Column(length = 10)
    private String currency;         // KRW 등

    private LocalDateTime approvedAt;
    private LocalDateTime callbackReceivedAt;

    @Column(columnDefinition = "BINARY(16)")
    private UUID reserveTaskId;      // 재고 예약 식별자(선택)

    /* ===== 기존 결제(아임포트 등) 파트와 호환 필드 ===== */
    @Column(name = "imp_u_id", length = 64)
    private String impUId;           // 기존 코드 호환 (PaymentService에서 setImpUId)

    /* ===== 헬퍼(팩토리) ===== */
    public static Payment approvedLine(String orderId,
                                       Product product,
                                       NormalUser user,
                                       String size, String color, long qty,
                                       long lineAmount,
                                       String paymentKey,
                                       String paymentType,
                                       String currency,
                                       LocalDateTime approvedAt,
                                       UUID reserveTaskId) {
        Payment p = new Payment();
        p.orderId = orderId;
        p.product = product;
        p.normalUser = user;
        p.size = size;
        p.color = color;
        p.totalCnt = qty;

        p.status = PaymentStatus.APPROVED;
        p.amount = lineAmount;
        p.refundedAmountTotal = 0L;

        p.paymentKey = paymentKey;
        p.paymentType = paymentType;
        p.currency = currency;
        p.approvedAt = approvedAt;
        p.callbackReceivedAt = LocalDateTime.now();
        p.reserveTaskId = reserveTaskId;
        return p;
    }

    public static Payment failedAttempt(String orderId, String errorCode, String errorMessage) {
        Payment p = new Payment();
        p.orderId = orderId;
        p.status = PaymentStatus.FAILED;
        p.callbackReceivedAt = LocalDateTime.now();
        p.refundedAmountTotal = 0L;
        // 필요 시, 에러코드/메시지 칼럼을 추가하세요.
        return p;
    }

    public void applyRefund(long refundAmount) {
        if (this.refundedAmountTotal == null) this.refundedAmountTotal = 0L;
        this.refundedAmountTotal += refundAmount;
        if (this.amount != null && this.refundedAmountTotal >= this.amount) {
            this.status = PaymentStatus.REFUNDED;
        }
    }
}
