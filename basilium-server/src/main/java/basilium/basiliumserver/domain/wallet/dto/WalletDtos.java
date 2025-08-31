// src/main/java/basilium/basiliumserver/domain/wallet/dto/WalletDtos.java
package basilium.basiliumserver.domain.wallet.dto;

import basilium.basiliumserver.domain.wallet.entity.WalletLedgerRefType;
import basilium.basiliumserver.domain.wallet.entity.WalletLedgerType;
import lombok.*;

import java.time.LocalDateTime;

public final class WalletDtos {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class BalanceResponse {
        private Long userNumber;
        private Long balance;
        private LocalDateTime updatedAt;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class LedgerItem {
        private Long id;
        private WalletLedgerType type;
        private WalletLedgerRefType refType;
        private String refId;
        private Long amount;
        private Long balanceAfter;
        private String uniqueKey;
        private LocalDateTime createdAt;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DebitRequest {
        private String orderId;
        private Long amount; // 결제에서 확정한 차감 금액
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CreditReviewRequest {
        private Long paymentId;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CreditOrderConfirmedRequest {
        private String orderId;
    }
}
