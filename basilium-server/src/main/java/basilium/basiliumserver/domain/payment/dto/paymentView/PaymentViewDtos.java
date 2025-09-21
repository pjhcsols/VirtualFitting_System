package basilium.basiliumserver.domain.payment.dto.paymentView;

import basilium.basiliumserver.domain.payment.entity.PaymentStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class PaymentViewDtos {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ItemSummary {
        private Long productId;
        private String productName;
        private String size;
        private String color;
        private Long quantity;
        private PaymentStatus status;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PaymentSummaryDto {
        private Long paymentId;
        private String orderId;
        private Long buyerUserNumber;        // NormalUser.userNumber
        private PaymentStatus status;
        private String currency;
        private LocalDateTime intentExpiresAt;
        private Long amount;                 // 승인 금액(서버 저장 값)
        private Long refundedAmountTotal;
        private LocalDateTime createdAt;
        private LocalDateTime approvedAt;
        private List<ItemSummary> items;     // 상품명 + 낱개 상태
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class LineDetailDto {
        private Long lineId;
        private Long productId;
        private String productName;
        private String size;
        private String color;
        private Long quantity;

        private Long unitPriceAfterBrandDiscount;
        private Long lineBase;
        private Long couponWalletId;
        private Long couponDiscount;
        private Long lineAfterCoupon;
        private Long plannedAllocatedPoint;
        private Long finalLinePayable;

        private PaymentStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime approvedAt;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PaymentDetailDto {
        private Long paymentId;
        private String orderId;
        private Long buyerUserNumber;
        private PaymentStatus status;
        private String currency;
        private LocalDateTime intentExpiresAt;
        private Long pointsToUse;
        private Long amount;
        private Long refundedAmountTotal;
        private String paymentKey;
        private String paymentType;
        private String pgErrorCode;
        private String pgErrorMessage;
        private LocalDateTime createdAt;
        private LocalDateTime approvedAt;
        private LocalDateTime callbackReceivedAt;

        private List<LineDetailDto> lines;
    }
}
