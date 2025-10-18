// src/main/java/basilium/basiliumserver/domain/order/controller/apiDocs/OrderApiDocs.java
package basilium.basiliumserver.domain.order.controller.apiDocs;

import basilium.basiliumserver.domain.order.dto.OrderViewDtos.*;
import basilium.basiliumserver.domain.order.entity.OrderStatus;
import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.auth.support.AuthUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@Tag(name = "주문", description = "주문 생성/조회/상태 전이(구매자·브랜드·어드민) API")
@RequestMapping(value = "/b1/orders", produces = MediaType.APPLICATION_JSON_VALUE)
public interface OrderApiDocs {

    /* ================= NORMAL ================= */

    @Operation(summary = "내 주문 목록", description = "로그인한 일반 유저의 주문 목록(최신순)")
    @GetMapping("/my")
    ResponseEntity<ApiResponse<Page<OrderSummaryDto>>> myOrders(
            @Parameter(description = "인증 사용자 ID(일반 유저). SecurityContext에서 주입", required = true, example = "10001")
            @AuthUser String authUserId,
            @ParameterObject Pageable pageable
    );

    @Operation(summary = "내 주문 상세", description = "본인 주문 1건 상세")
    @GetMapping("/my/{orderId}")
    ResponseEntity<ApiResponse<OrderDetailDto>> myOrderDetail(
            @AuthUser String authUserId,
            @PathVariable String orderId
    );

    @Operation(
            summary = "배송지 수정(결제완료~배송준비중 구간)",
            description = "구매자 본인이 배송지를 수정할 수 있는 상태에서만 가능"
    )
    @PatchMapping(value = "/my/{orderId}/shipping", consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<ApiResponse<Void>> updateShipping(
            @AuthUser String authUserId,
            @PathVariable String orderId,
            @RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ShippingUpdateRequest.class),
                            examples = @ExampleObject(
                                    name = "배송지 수정 예시",
                                    value = """
                                    {
                                      "recipientName": "홍길동",
                                      "recipientPhone": "010-1234-5678",
                                      "zipCode": "06236",
                                      "addr1": "서울 강남구 테헤란로 123",
                                      "addr2": "101동 1001호",
                                      "shippingMemo": "부재 시 문 앞"
                                    }
                                    """
                            )
                    )
            )
            @org.springframework.web.bind.annotation.RequestBody ShippingUpdateRequest request
    );

    @Operation(summary = "구매확정", description = "배송완료 상태에서 구매확정 → 지갑 2% 적립(멱등)")
    @PostMapping("/my/{orderId}/confirm")
    ResponseEntity<ApiResponse<Void>> confirm(
            @AuthUser String authUserId,
            @PathVariable String orderId
    );

    @Operation(summary = "주문 취소 신청", description = "결제완료 상태에서만 구매자가 취소 신청")
    @PostMapping("/my/{orderId}/cancel")
    ResponseEntity<ApiResponse<Void>> requestCancel(
            @AuthUser String authUserId,
            @PathVariable String orderId,
            @RequestBody(required = false) RefundOrReturnRequest req
    );

    @Operation(summary = "환불 신청", description = "배송완료 상태에서 환불 신청")
    @PostMapping("/my/{orderId}/refund")
    ResponseEntity<ApiResponse<Void>> requestRefund(
            @AuthUser String authUserId,
            @PathVariable String orderId,
            @RequestBody(required = false) RefundOrReturnRequest req
    );

    @Operation(summary = "반품 신청", description = "배송완료 상태에서 반품 신청")
    @PostMapping("/my/{orderId}/return")
    ResponseEntity<ApiResponse<Void>> requestReturn(
            @AuthUser String authUserId,
            @PathVariable String orderId,
            @RequestBody(required = false) RefundOrReturnRequest req
    );

    /* ================= BRAND ================= */

    @Operation(summary = "내 판매 주문 목록(브랜드)", description = "내 상품에 대한 주문 목록(최신순)")
    @GetMapping("/brand/my")
    ResponseEntity<ApiResponse<Page<OrderSummaryDto>>> brandOrders(
            @AuthUser String authUserId,
            @ParameterObject Pageable pageable
    );

    @Operation(summary = "내 판매 주문 상세(브랜드)", description = "내 상품이 포함된 주문의 상세")
    @GetMapping("/brand/my/{orderId}")
    ResponseEntity<ApiResponse<OrderDetailDto>> brandOrderDetail(
            @AuthUser String authUserId,
            @PathVariable String orderId
    );

    @Operation(summary = "배송 준비중으로 전이", description = "결제완료 → 배송준비중")
    @PostMapping("/brand/my/{orderId}/preparing")
    ResponseEntity<ApiResponse<Void>> brandToPreparing(
            @AuthUser String authUserId,
            @PathVariable String orderId
    );

    @Operation(
            summary = "배송 중으로 전이(송장 입력)",
            description = "배송준비중 → 배송중, 택배사/송장번호 필수"
    )
    @PostMapping(value = "/brand/my/{orderId}/in-transit", consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<ApiResponse<Void>> brandToInTransit(
            @AuthUser String authUserId,
            @PathVariable String orderId,
            @RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = BrandShipTransitRequest.class),
                            examples = @ExampleObject(
                                    name = "배송중 전이 예시",
                                    value = """
                                    {
                                      "courierCode": "CJ",
                                      "courierName": "CJ대한통운",
                                      "trackingNo": "1234-5678-9999"
                                    }
                                    """
                            )
                    )
            )
            @org.springframework.web.bind.annotation.RequestBody BrandShipTransitRequest request
    );

    @Operation(summary = "배송 완료로 전이", description = "배송중 → 배송완료")
    @PostMapping("/brand/my/{orderId}/delivered")
    ResponseEntity<ApiResponse<Void>> brandToDelivered(
            @AuthUser String authUserId,
            @PathVariable String orderId
    );

    @Operation(summary = "취소 신청 목록(브랜드)", description = "취소 요청된 주문만 페이지 조회")
    @GetMapping("/brand/my/cancel-requests")
    ResponseEntity<ApiResponse<Page<OrderSummaryDto>>> brandCancelRequested(
            @AuthUser String authUserId,
            @ParameterObject Pageable pageable
    );

    @Operation(summary = "취소 신청 승인(브랜드)", description = "CANCEL_REQUESTED → REFUND_REQUESTED")
    @PostMapping("/brand/my/{orderId}/cancel-requests/approve")
    ResponseEntity<ApiResponse<Void>> brandApproveCancel(
            @AuthUser String authUserId,
            @PathVariable String orderId
    );

    @Operation(summary = "취소 신청 거절(브랜드)", description = "CANCEL_REQUESTED → PAID")
    @PostMapping("/brand/my/{orderId}/cancel-requests/reject")
    ResponseEntity<ApiResponse<Void>> brandRejectCancel(
            @AuthUser String authUserId,
            @PathVariable String orderId
    );

    /* ================= ADMIN ================= */

    @Operation(
            summary = "주문 목록(어드민) — 필터 조회",
            description = "buyerUserNumber/status가 없으면 전체"
    )
    @GetMapping("/admin")
    ResponseEntity<ApiResponse<Page<OrderSummaryDto>>> adminOrders(
            @RequestParam(required = false) Long buyerUserNumber,
            @RequestParam(required = false) OrderStatus status,
            @ParameterObject Pageable pageable
    );

    @Operation(summary = "주문 상세(어드민)")
    @GetMapping("/admin/{orderId}")
    ResponseEntity<ApiResponse<OrderDetailDto>> adminOrderDetail(
            @PathVariable String orderId
    );

    @Operation(summary = "취소 신청 목록(어드민)")
    @GetMapping("/admin/cancel-requests")
    ResponseEntity<ApiResponse<Page<OrderSummaryDto>>> adminCancelRequested(
            @ParameterObject Pageable pageable
    );

    @Operation(
            summary = "환불/반품 승인(어드민)",
            description = "전액 환불 시 쿠폰 복구 여부/재고 복원 여부 옵션"
    )
    @PostMapping(value = "/admin/{orderId}/refunds/approve", consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<ApiResponse<Void>> adminApproveRefundOrReturn(
            @PathVariable String orderId,
            @RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = AdminRefundApproveRequest.class),
                            examples = @ExampleObject(
                                    name = "환불 승인 예시",
                                    value = """
                                    {
                                      "cashRefundAmount": 12000,
                                      "walletRefundAmount": 2000,
                                      "restoreCouponIfFull": true,
                                      "restockInventory": true
                                    }
                                    """
                            )
                    )
            )
            @org.springframework.web.bind.annotation.RequestBody AdminRefundApproveRequest req
    );

    @Operation(summary = "환불/반품 거절(어드민)")
    @PostMapping("/admin/{orderId}/refunds/reject")
    ResponseEntity<ApiResponse<Void>> adminRejectRefundOrReturn(
            @PathVariable String orderId
    );

    @Operation(
            summary = "강제 취소(어드민)",
            description = "전액 환불/포인트 환급/쿠폰복구/재고복원 옵션"
    )
    @PostMapping(value = "/admin/{orderId}/cancel", consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<ApiResponse<Void>> adminCancelAny(
            @PathVariable String orderId,
            @RequestBody(required = false) AdminCancelRequest opt
    );

    @Operation(summary = "상태 임의 전이(어드민)")
    @PostMapping("/admin/{orderId}/status")
    ResponseEntity<ApiResponse<Void>> adminSetStatus(
            @PathVariable String orderId,
            @RequestParam OrderStatus toStatus
    );
}
