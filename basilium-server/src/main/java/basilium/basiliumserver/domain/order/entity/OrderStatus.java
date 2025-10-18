// src/main/java/basilium/basiliumserver/domain/order/entity/OrderStatus.java
package basilium.basiliumserver.domain.order.entity;

public enum OrderStatus {
    PAID,                // 결제 완료(간편결제), 송금 확인 중(무통장입금)
    PREPARING,           // 배송 준비 중 (브랜드)
    IN_TRANSIT,          // 배송 중 (브랜드)
    DELIVERED,           // 배송 완료 (브랜드)
    PURCHASE_CONFIRMED,  // 구매 확정 (구매자)
    CANCEL_REQUESTED,    // 결제완료 상태에서 구매자 취소 신청
    REFUND_REQUESTED,    // 환불/취소 승인되어 환불 심사 중
    RETURN_REQUESTED,    // 반품 신청(DELIVERED에서)
    PARTIALLY_REFUNDED,  // 부분 환불
    REFUNDED,            // 전액 환불
    CANCELLED            // 어드민 강제 취소(어느 상태든)
}
