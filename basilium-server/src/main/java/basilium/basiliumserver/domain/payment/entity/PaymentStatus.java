// src/main/java/basilium/basiliumserver/domain/payment/entity/PaymentStatus.java
package basilium.basiliumserver.domain.payment.entity;

//의도 만료는 먼가?
public enum PaymentStatus {
    INIT,        // 결제 의도 생성(라인/예약만 존재, 미승인)
    APPROVED,    // 결제 승인(성공)
    CANCELLED,   // 사용자가 의도 취소(승인 전)
    FAILED,      // 실패 콜백/금액불일치/만료 등
    EXPIRED,     // 의도 만료(의미적 표기: INIT→FAILED로 전환하는 실처리는 예약 만료 핸들러가 담당)
    REFUNDED     // 전액 환불 완료
}
