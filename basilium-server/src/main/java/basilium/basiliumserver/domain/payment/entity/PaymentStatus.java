package basilium.basiliumserver.domain.payment.entity;

public enum PaymentStatus {
    APPROVED,    // 결제 승인
    CANCELLED,   // 승인 후 전체 취소
    REFUNDED,    // 승인 후 전액 환불(부분 환불 누적이 총액과 같아진 상태)
    FAILED       // 결제 실패 시(성공 콜백 대신 실패 콜백 저장용)
}
