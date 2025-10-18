// src/main/java/basilium/basiliumserver/domain/order/controller/OrderController.java
package basilium.basiliumserver.domain.order.controller;

import basilium.basiliumserver.domain.order.controller.apiDocs.OrderApiDocs;
import basilium.basiliumserver.domain.order.dto.OrderViewDtos.*;
import basilium.basiliumserver.domain.order.entity.OrderStatus;
import basilium.basiliumserver.domain.order.service.OrderService;
import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.auth.support.AuthUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class OrderController implements OrderApiDocs {

    private final OrderService orderService;

    /* ========== NORMAL ========== */

    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<OrderSummaryDto>>> myOrders(
            @AuthUser String authUserId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.listForBuyer(Long.valueOf(authUserId), pageable)));
    }

    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    public ResponseEntity<ApiResponse<OrderDetailDto>> myOrderDetail(
            @AuthUser String authUserId, String orderId) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.getDetailForNormal(Long.valueOf(authUserId), orderId)));
    }

    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    public ResponseEntity<ApiResponse<Void>> updateShipping(
            @AuthUser String authUserId, String orderId, ShippingUpdateRequest request) {
        orderService.updateShippingAddressForBuyer(Long.valueOf(authUserId), orderId, request);
        return ResponseEntity.ok(ApiResponse.success());
    }

    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    public ResponseEntity<ApiResponse<Void>> confirm(@AuthUser String authUserId, String orderId) {
        orderService.confirmPurchase(Long.valueOf(authUserId), orderId);
        return ResponseEntity.ok(ApiResponse.success());
    }

    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    public ResponseEntity<ApiResponse<Void>> requestCancel(
            @AuthUser String authUserId, String orderId, RefundOrReturnRequest req) {
        orderService.requestCancel(Long.valueOf(authUserId), orderId, req);
        return ResponseEntity.ok(ApiResponse.success());
    }

    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    public ResponseEntity<ApiResponse<Void>> requestRefund(
            @AuthUser String authUserId, String orderId, RefundOrReturnRequest req) {
        orderService.requestRefund(Long.valueOf(authUserId), orderId, req);
        return ResponseEntity.ok(ApiResponse.success());
    }

    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    public ResponseEntity<ApiResponse<Void>> requestReturn(
            @AuthUser String authUserId, String orderId, RefundOrReturnRequest req) {
        orderService.requestReturn(Long.valueOf(authUserId), orderId, req);
        return ResponseEntity.ok(ApiResponse.success());
    }

    /* ========== BRAND ========== */

    @PreAuthorize("hasRole('BRAND') and #authUserId == authentication.principal")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<OrderSummaryDto>>> brandOrders(
            @AuthUser String authUserId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.listForBrand(Long.valueOf(authUserId), pageable)));
    }

    @PreAuthorize("hasRole('BRAND') and #authUserId == authentication.principal")
    public ResponseEntity<ApiResponse<OrderDetailDto>> brandOrderDetail(
            @AuthUser String authUserId, String orderId) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.getDetailForBrand(Long.valueOf(authUserId), orderId)));
    }

    @PreAuthorize("hasRole('BRAND') and #authUserId == authentication.principal")
    public ResponseEntity<ApiResponse<Void>> brandToPreparing(
            @AuthUser String authUserId, String orderId) {
        orderService.brandToPreparing(Long.valueOf(authUserId), orderId);
        return ResponseEntity.ok(ApiResponse.success());
    }

    @PreAuthorize("hasRole('BRAND') and #authUserId == authentication.principal")
    public ResponseEntity<ApiResponse<Void>> brandToInTransit(
            @AuthUser String authUserId, String orderId, BrandShipTransitRequest request) {
        orderService.brandToInTransit(Long.valueOf(authUserId), orderId, request);
        return ResponseEntity.ok(ApiResponse.success());
    }

    @PreAuthorize("hasRole('BRAND') and #authUserId == authentication.principal")
    public ResponseEntity<ApiResponse<Void>> brandToDelivered(
            @AuthUser String authUserId, String orderId) {
        orderService.brandToDelivered(Long.valueOf(authUserId), orderId);
        return ResponseEntity.ok(ApiResponse.success());
    }

    @PreAuthorize("hasRole('BRAND') and #authUserId == authentication.principal")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<OrderSummaryDto>>> brandCancelRequested(
            @AuthUser String authUserId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.listCancelRequestedForBrand(Long.valueOf(authUserId), pageable)));
    }

    @PreAuthorize("hasRole('BRAND') and #authUserId == authentication.principal")
    public ResponseEntity<ApiResponse<Void>> brandApproveCancel(
            @AuthUser String authUserId, String orderId) {
        orderService.brandApproveCancel(Long.valueOf(authUserId), orderId);
        return ResponseEntity.ok(ApiResponse.success());
    }

    @PreAuthorize("hasRole('BRAND') and #authUserId == authentication.principal")
    public ResponseEntity<ApiResponse<Void>> brandRejectCancel(
            @AuthUser String authUserId, String orderId) {
        orderService.brandRejectCancel(Long.valueOf(authUserId), orderId);
        return ResponseEntity.ok(ApiResponse.success());
    }

    /* ========== ADMIN ========== */

    @PreAuthorize("hasRole('SUPER')")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<OrderSummaryDto>>> adminOrders(
            Long buyerUserNumber, OrderStatus status, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.listForAdmin(java.util.Optional.ofNullable(buyerUserNumber),
                        java.util.Optional.ofNullable(status), pageable)));
    }

    @PreAuthorize("hasRole('SUPER')")
    public ResponseEntity<ApiResponse<OrderDetailDto>> adminOrderDetail(String orderId) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getDetailForAdmin(orderId)));
    }

    @PreAuthorize("hasRole('SUPER')")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<OrderSummaryDto>>> adminCancelRequested(
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(orderService.listCancelRequestedForAdmin(pageable)));
    }

    @PreAuthorize("hasRole('SUPER')")
    public ResponseEntity<ApiResponse<Void>> adminApproveRefundOrReturn(String orderId, AdminRefundApproveRequest req) {
        orderService.adminApproveRefundOrReturn(orderId, req);
        return ResponseEntity.ok(ApiResponse.success());
    }

    @PreAuthorize("hasRole('SUPER')")
    public ResponseEntity<ApiResponse<Void>> adminRejectRefundOrReturn(String orderId) {
        orderService.adminRejectRefundOrReturn(orderId);
        return ResponseEntity.ok(ApiResponse.success());
    }

    @PreAuthorize("hasRole('SUPER')")
    public ResponseEntity<ApiResponse<Void>> adminCancelAny(String orderId, AdminCancelRequest opt) {
        orderService.adminCancelAny(orderId, opt);
        return ResponseEntity.ok(ApiResponse.success());
    }

    @PreAuthorize("hasRole('SUPER')")
    public ResponseEntity<ApiResponse<Void>> adminSetStatus(String orderId, OrderStatus toStatus) {
        orderService.adminSetStatus(orderId, toStatus);
        return ResponseEntity.ok(ApiResponse.success());
    }
}
