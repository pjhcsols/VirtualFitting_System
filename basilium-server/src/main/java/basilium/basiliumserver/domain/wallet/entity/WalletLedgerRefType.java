package basilium.basiliumserver.domain.wallet.entity;

public enum WalletLedgerRefType {
    REVIEW,             // 리뷰 적립 (uniqueKey=REVIEW:{paymentId})
    ORDER_CONFIRMED,    // 구매확정 적립 (uniqueKey=ORDER_CONFIRMED:{orderId})
    PAYMENT,            // 결제 차감 (uniqueKey=PAYMENT:{orderId})
    ADJUST              // 운영/관리자 조정
}