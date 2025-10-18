// src/main/java/basilium/basiliumserver/domain/order/dto/OrderViewDtos.java
package basilium.basiliumserver.domain.order.dto;

import basilium.basiliumserver.domain.order.entity.OrderStatus;
import basilium.basiliumserver.domain.payment.entity.PaymentStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class OrderViewDtos {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OrderSummaryDto {
        private String orderId;
        private Long buyerUserNumber;
        private OrderStatus status;
        private Long originalAmount;
        private Long brandDiscountAmount;
        private Long userExtraDiscountAmount;
        private Long finalPayAmount;
        private Long couponUsedAmount;
        private Long walletUsedAmount;
        private LocalDateTime createdAt;
        private LocalDateTime paidAt;
        private LocalDateTime deliveredAt;
        private LocalDateTime confirmedAt;
    }

    public enum ReviewAvail { WRITABLE, NOT_WRITABLE }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OrderDetailDto {
        private String orderId;
        private Long buyerUserNumber;
        private OrderStatus status;

        private Long originalAmount;
        private Long brandDiscountAmount;
        private Long userExtraDiscountAmount;
        private Long finalPayAmount;
        private Long couponUsedAmount;
        private Long walletUsedAmount;

        private String recipientName;
        private String recipientPhone;
        private String zipCode;
        private String addr1;
        private String addr2;
        private String shippingMemo;

        private String courierCode;
        private String courierName;
        private String trackingNo;

        private LocalDateTime createdAt;
        private LocalDateTime paidAt;
        private LocalDateTime deliveredAt;
        private LocalDateTime confirmedAt;

        private List<LineItem> items;
        private ReviewAvail reviewAvail;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class LineItem {
        private Long productId;
        private String productName;
        private String size;
        private String color;
        private Long quantity;
        private Long unitPriceAfterBrandDiscount;
        private Long lineBase;
        private Long couponDiscount;
        private Long lineAfterCoupon;
        private PaymentStatus paymentLineStatus;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ShippingUpdateRequest {
        private String recipientName; private String recipientPhone;
        private String zipCode; private String addr1; private String addr2; private String shippingMemo;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class BrandShipTransitRequest {
        private String courierCode; private String courierName; private String trackingNo;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class RefundOrReturnRequest {
        private String reason;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AdminRefundApproveRequest {
        private Long cashRefundAmount;
        private Long walletRefundAmount;
        private boolean restoreCouponIfFull;
        private boolean restockInventory;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AdminCancelRequest {
        private boolean refundCashAll;
        private boolean refundWalletAll;
        private boolean restoreCouponIfFull;
        private boolean restockInventory;
    }
}
