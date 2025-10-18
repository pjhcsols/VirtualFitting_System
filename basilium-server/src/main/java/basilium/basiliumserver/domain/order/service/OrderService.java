// src/main/java/basilium/basiliumserver/domain/order/service/OrderService.java
package basilium.basiliumserver.domain.order.service;

import basilium.basiliumserver.domain.coupon.repository.NormalCouponWalletRepository;
import basilium.basiliumserver.domain.order.dto.OrderViewDtos.*;
import basilium.basiliumserver.domain.order.entity.Order;
import basilium.basiliumserver.domain.order.entity.OrderStatus;
import basilium.basiliumserver.domain.order.repository.OrderRepository;
import basilium.basiliumserver.domain.payment.entity.Payment;
import basilium.basiliumserver.domain.payment.entity.PaymentIntentLine;
import basilium.basiliumserver.domain.payment.entity.PaymentStatus;
import basilium.basiliumserver.domain.payment.repository.PaymentIntentLineRepository;
import basilium.basiliumserver.domain.payment.repository.PaymentReadRepository;
import basilium.basiliumserver.domain.payment.repository.PaymentRepository;
import basilium.basiliumserver.domain.product.entity.Color;
import basilium.basiliumserver.domain.product.entity.Size;
import basilium.basiliumserver.domain.product.service.ProductService;
import basilium.basiliumserver.domain.review.repository.ReviewRepository;
import basilium.basiliumserver.domain.wallet.entity.WalletLedgerRefType;
import basilium.basiliumserver.domain.wallet.service.WalletService;
import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepo;
    private final PaymentRepository paymentRepo;
    private final PaymentReadRepository paymentReadRepo;
    private final PaymentIntentLineRepository lineRepo;

    private final WalletService walletService;
    private final NormalCouponWalletRepository couponWalletRepo;
    private final ProductService productService;

    // Review 포트 제거 — 직접 Repo 사용
    private final ReviewRepository reviewRepository;

    /* ========================= 생성 (멱등) ========================= */
    /** 결제(APPROVED) 성공 직후 한 번만 생성 */
    @Transactional
    public void createFromApprovedPayment(String orderId) {
        if (orderRepo.findByOrderId(orderId).isPresent()) return;

        Payment p = paymentRepo.findByOrderId(orderId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "Payment 없음: " + orderId));
        if (p.getStatus() != PaymentStatus.APPROVED) {
            throw new BasiliumCustomException(ErrorCode.CONFLICT, "APPROVED 결제만 주문 생성 가능");
        }

        List<PaymentIntentLine> lines = lineRepo.findAllByOrderId(orderId);
        if (lines.isEmpty()) throw new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "결제 라인 없음: " + orderId);

        long couponTotal    = lines.stream().mapToLong(l -> Optional.ofNullable(l.getCouponDiscount()).orElse(0L)).sum();
        long lineBaseTotal  = lines.stream().mapToLong(PaymentIntentLine::getLineBase).sum();
        long originalTotal  = lines.stream().mapToLong(l -> {
            Long baseUnit = Optional.ofNullable(l.getProduct().getProductPrice()).orElse(0L);
            return baseUnit * Optional.ofNullable(l.getQuantity()).orElse(0L);
        }).sum();
        long brandDiscountTotal = Math.max(0L, originalTotal - lineBaseTotal);

        long finalPayAmount = Optional.ofNullable(
                paymentReadRepo.sumNetApprovedAmountByOrderId(orderId)
        ).orElse(0L);

        long walletUsed = Optional.ofNullable(p.getPointsToUse()).orElse(0L);

        Order order = Order.paid(
                orderId,
                p.getNormalUser().getUserNumber(),
                originalTotal,
                brandDiscountTotal,
                couponTotal,
                finalPayAmount,
                /* 사용요약 */ couponTotal,
                walletUsed,
                Optional.ofNullable(p.getApprovedAt()).orElseGet(LocalDateTime::now)
        );

        orderRepo.save(order);
        log.info("[Order] created: orderId={}, finalPay={}", orderId, finalPayAmount);
    }

    /* ========================= 조회 ========================= */
    public Page<OrderSummaryDto> listForBuyer(Long buyerUserNumber, Pageable pageable) {
        return orderRepo.findByUserNumberOrderByCreatedAtDesc(buyerUserNumber, pageable)
                .map(this::toSummaryDto);
    }

    public Page<OrderSummaryDto> listForBrand(Long brandUserNumber, Pageable pageable) {
        return orderRepo.findPageByBrandUserNumber(brandUserNumber, pageable)
                .map(this::toSummaryDto);
    }

    public Page<OrderSummaryDto> listCancelRequestedForBrand(Long brandUserNumber, Pageable pageable) {
        return orderRepo.findCancelRequestedByBrand(brandUserNumber, pageable)
                .map(this::toSummaryDto);
    }

    public Page<OrderSummaryDto> listForAdmin(Optional<Long> buyerUserNumber, Optional<OrderStatus> status, Pageable pageable) {
        return orderRepo.adminFilter(buyerUserNumber.orElse(null), status.orElse(null), pageable)
                .map(this::toSummaryDto);
    }

    public Page<OrderSummaryDto> listCancelRequestedForAdmin(Pageable pageable) {
        return orderRepo.adminCancelRequested(pageable).map(this::toSummaryDto);
    }

    public OrderDetailDto getDetailForNormal(Long authUserNumber, String orderId) {
        Order o = load(orderId);
        if (!Objects.equals(o.getUserNumber(), authUserNumber)) throw new AccessDeniedException("본인 주문만 조회 가능");
        return toDetailDto(o, null);
    }

    public OrderDetailDto getDetailForBrand(Long brandUserNumber, String orderId) {
        Order o = load(orderId);
        assertBrandOwns(brandUserNumber, orderId);
        return toDetailDto(o, brandUserNumber);
    }

    public OrderDetailDto getDetailForAdmin(String orderId) {
        return toDetailDto(load(orderId), null);
    }

    /* ========================= 구매자 변경/확정/신청 ========================= */
    @Transactional
    public void updateShippingAddressForBuyer(Long authUserNumber, String orderId, ShippingUpdateRequest req) {
        Order o = load(orderId);
        if (!Objects.equals(o.getUserNumber(), authUserNumber))
            throw new AccessDeniedException("본인 주문만 수정 가능");
        try {
            o.updateShippingIfEditable(
                    req.getRecipientName(),
                    req.getRecipientPhone(),
                    req.getZipCode(),
                    req.getAddr1(),
                    req.getAddr2(),
                    req.getShippingMemo()
            );
        } catch (IllegalStateException e) {
            throw new BasiliumCustomException(ErrorCode.CONFLICT, e.getMessage());
        }
        orderRepo.save(o);
    }

    @Transactional
    public void confirmPurchase(Long authUserNumber, String orderId) {
        Order o = load(orderId);
        if (!Objects.equals(o.getUserNumber(), authUserNumber))
            throw new AccessDeniedException("본인 주문만 구매확정 가능");

        boolean changed;
        try {
            changed = o.confirmByBuyer(LocalDateTime.now());
        } catch (IllegalStateException e) {
            throw new BasiliumCustomException(ErrorCode.CONFLICT, e.getMessage());
        }
        if (!changed) return;

        long accrual = BigDecimal.valueOf(o.getFinalPayAmount())
                .multiply(BigDecimal.valueOf(2).divide(BigDecimal.valueOf(100)))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();

        if (accrual > 0) {
            String uk = "ORDER_CONFIRM:" + o.getOrderId();
            walletService.credit(o.getUserNumber(), accrual, WalletLedgerRefType.PAYMENT, o.getOrderId(), uk);
        }
        orderRepo.save(o);
    }

    @Transactional
    public void requestCancel(Long authUserNumber, String orderId, RefundOrReturnRequest req) {
        Order o = load(orderId);
        if (!Objects.equals(o.getUserNumber(), authUserNumber))
            throw new AccessDeniedException("본인 주문만 신청 가능");
        try {
            o.requestCancelByBuyer();
        } catch (IllegalStateException e) {
            throw new BasiliumCustomException(ErrorCode.CONFLICT, e.getMessage());
        }
        orderRepo.save(o);
        log.info("[Order] cancel requested. orderId={}, reason={}", orderId, req != null ? req.getReason() : null);
    }

    @Transactional
    public void requestRefund(Long authUserNumber, String orderId, RefundOrReturnRequest req) {
        Order o = load(orderId);
        if (!Objects.equals(o.getUserNumber(), authUserNumber))
            throw new AccessDeniedException("본인 주문만 신청 가능");
        if (o.getStatus() != OrderStatus.DELIVERED)
            throw new BasiliumCustomException(ErrorCode.CONFLICT, "배송 완료 상태에서만 환불 신청 가능");
        o.adminSetStatus(OrderStatus.REFUND_REQUESTED, LocalDateTime.now());
        orderRepo.save(o);
    }

    @Transactional
    public void requestReturn(Long authUserNumber, String orderId, RefundOrReturnRequest req) {
        Order o = load(orderId);
        if (!Objects.equals(o.getUserNumber(), authUserNumber))
            throw new AccessDeniedException("본인 주문만 신청 가능");
        if (o.getStatus() != OrderStatus.DELIVERED)
            throw new BasiliumCustomException(ErrorCode.CONFLICT, "배송 완료 상태에서만 반품 신청 가능");
        o.adminSetStatus(OrderStatus.RETURN_REQUESTED, LocalDateTime.now());
        orderRepo.save(o);
    }

    /* ========================= 브랜드 전이/승인/거절 ========================= */
    @Transactional
    public void brandToPreparing(Long brandUserNumber, String orderId) {
        assertBrandOwns(brandUserNumber, orderId);
        Order o = load(orderId);
        try { o.toPreparingByBrand(); }
        catch (IllegalStateException e) { throw new BasiliumCustomException(ErrorCode.CONFLICT, e.getMessage()); }
        orderRepo.save(o);
    }

    @Transactional
    public void brandToInTransit(Long brandUserNumber, String orderId, BrandShipTransitRequest req) {
        assertBrandOwns(brandUserNumber, orderId);
        Order o = load(orderId);
        try { o.toInTransitByBrand(req.getCourierCode(), req.getCourierName(), req.getTrackingNo()); }
        catch (IllegalStateException e) { throw new BasiliumCustomException(ErrorCode.CONFLICT, e.getMessage()); }
        orderRepo.save(o);
    }

    @Transactional
    public void brandToDelivered(Long brandUserNumber, String orderId) {
        assertBrandOwns(brandUserNumber, orderId);
        Order o = load(orderId);
        try { o.toDeliveredByBrand(LocalDateTime.now()); }
        catch (IllegalStateException e) { throw new BasiliumCustomException(ErrorCode.CONFLICT, e.getMessage()); }
        orderRepo.save(o);
    }

    // 취소요청 승인/거절
    @Transactional
    public void brandApproveCancel(Long brandUserNumber, String orderId) {
        assertBrandOwns(brandUserNumber, orderId);
        Order o = load(orderId);
        if (o.getStatus() != OrderStatus.CANCEL_REQUESTED)
            throw new BasiliumCustomException(ErrorCode.CONFLICT, "CANCEL_REQUESTED 상태가 아님");
        o.adminSetStatus(OrderStatus.REFUND_REQUESTED, LocalDateTime.now());
        orderRepo.save(o);
    }

    @Transactional
    public void brandRejectCancel(Long brandUserNumber, String orderId) {
        assertBrandOwns(brandUserNumber, orderId);
        Order o = load(orderId);
        if (o.getStatus() != OrderStatus.CANCEL_REQUESTED)
            throw new BasiliumCustomException(ErrorCode.CONFLICT, "CANCEL_REQUESTED 상태가 아님");
        o.adminSetStatus(OrderStatus.PAID, LocalDateTime.now());
        orderRepo.save(o);
    }

    /* ========================= 어드민: 환불/반품 승인/거절/취소 ========================= */
    @Transactional
    public void adminApproveRefundOrReturn(String orderId, AdminRefundApproveRequest req) {
        Order o = load(orderId);
        Payment p = paymentRepo.findByOrderId(orderId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "Payment 없음: " + orderId));

        long cashAmount   = Optional.ofNullable(req.getCashRefundAmount()).orElse(0L);
        long walletAmount = Optional.ofNullable(req.getWalletRefundAmount()).orElse(0L);

        if (cashAmount < 0) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "cashRefundAmount >= 0");
        long remainCash = Math.max(0L, Optional.ofNullable(p.getAmount()).orElse(0L)
                - Optional.ofNullable(p.getRefundedAmountTotal()).orElse(0L));
        if (cashAmount > remainCash) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "환불 가능 금액 초과");
        if (cashAmount > 0) {
            p.applyRefund(cashAmount);
            paymentRepo.save(p);
        }

        if (walletAmount < 0) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "walletRefundAmount >= 0");
        long pointsUsed = Optional.ofNullable(p.getPointsToUse()).orElse(0L);
        if (walletAmount > pointsUsed) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "원 결제 포인트 사용액 초과");
        if (walletAmount > 0) {
            String uk = "REFUND_POINTS:" + orderId + ":" + System.nanoTime();
            walletService.credit(o.getUserNumber(), walletAmount, WalletLedgerRefType.PAYMENT, orderId, uk);
        }

        boolean fullyRefunded = Optional.ofNullable(p.getRefundedAmountTotal()).orElse(0L)
                >= Optional.ofNullable(p.getAmount()).orElse(0L);

        // 전액 환불이면 쿠폰 복구
        if (req.isRestoreCouponIfFull() && fullyRefunded) {
            var used = couponWalletRepo.findUsedByOrderIdWithCampaign(orderId);
            if (!used.isEmpty()) {
                used.forEach(w -> couponWalletRepo.restoreUsedOne(w.getId(), orderId));
            }
        }

        // 재고 복원(옵션) — ★ enum 변환 반영
        if (req.isRestockInventory()) {
            List<PaymentIntentLine> lines = lineRepo.findAllByOrderId(orderId);
            for (var l : lines) {
                try {
                    productService.restoreProductQuantity(
                            l.getProduct().getProductId(),
                            Size.valueOf(l.getSize()),
                            Color.valueOf(l.getColor()),
                            l.getQuantity()
                    );
                } catch (Exception ex) {
                    log.warn("restock failed: orderId={}, lineId={}, ex={}", orderId, l.getId(), ex.toString(), ex);
                }
            }
        }

        if (fullyRefunded) o.adminSetStatus(OrderStatus.REFUNDED, LocalDateTime.now());
        else               o.adminSetStatus(OrderStatus.PARTIALLY_REFUNDED, LocalDateTime.now());
        orderRepo.save(o);
    }

    @Transactional
    public void adminCancelAny(String orderId, AdminCancelRequest opt) {
        Order o = load(orderId);
        Payment p = paymentRepo.findByOrderId(orderId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "Payment 없음: " + orderId));

        boolean refundCashAll   = opt == null || opt.isRefundCashAll();
        boolean refundWalletAll = opt == null || opt.isRefundWalletAll();
        boolean restoreCoupon   = opt == null || opt.isRestoreCouponIfFull();
        boolean restock         = opt != null && opt.isRestockInventory();

        long remainCash = Math.max(0L,
                Optional.ofNullable(p.getAmount()).orElse(0L) - Optional.ofNullable(p.getRefundedAmountTotal()).orElse(0L));
        if (refundCashAll && remainCash > 0) {
            p.applyRefund(remainCash);
            paymentRepo.save(p);
        }

        long pointsUsed = Optional.ofNullable(p.getPointsToUse()).orElse(0L);
        if (refundWalletAll && pointsUsed > 0) {
            String uk = "REFUND_POINTS_ALL:" + orderId + ":" + System.nanoTime();
            walletService.credit(o.getUserNumber(), pointsUsed, WalletLedgerRefType.PAYMENT, orderId, uk);
        }

        boolean fullyRefunded = Optional.ofNullable(p.getRefundedAmountTotal()).orElse(0L)
                >= Optional.ofNullable(p.getAmount()).orElse(0L);

        // 전액 환불이면 쿠폰 복구
        if (restoreCoupon && fullyRefunded) {
            var used = couponWalletRepo.findUsedByOrderIdWithCampaign(orderId);
            if (!used.isEmpty()) {
                used.forEach(w -> couponWalletRepo.restoreUsedOne(w.getId(), orderId));
            }
        }

        // 재고 복원(옵션) — ★ enum 변환 반영
        if (restock) {
            List<PaymentIntentLine> lines = lineRepo.findAllByOrderId(orderId);
            for (var l : lines) {
                try {
                    productService.restoreProductQuantity(
                            l.getProduct().getProductId(),
                            Size.valueOf(l.getSize()),
                            Color.valueOf(l.getColor()),
                            l.getQuantity()
                    );
                } catch (Exception ignored) { }
            }
        }

        o.adminSetStatus(OrderStatus.CANCELLED, LocalDateTime.now());
        orderRepo.save(o);
    }

    @Transactional
    public void adminRejectRefundOrReturn(String orderId) {
        Order o = load(orderId);
        if (o.getStatus() == OrderStatus.CANCEL_REQUESTED) {
            o.adminSetStatus(OrderStatus.PAID, LocalDateTime.now());
        } else if (o.getStatus() == OrderStatus.REFUND_REQUESTED || o.getStatus() == OrderStatus.RETURN_REQUESTED) {
            o.adminSetStatus(OrderStatus.DELIVERED, LocalDateTime.now());
        } else {
            throw new BasiliumCustomException(ErrorCode.CONFLICT, "거절 가능한 상태가 아님");
        }
        orderRepo.save(o);
    }

    @Transactional
    public void adminSetStatus(String orderId, OrderStatus to) {
        Order o = load(orderId);
        o.adminSetStatus(to, LocalDateTime.now());
        orderRepo.save(o);
    }

    /* ========================= 내부 ========================= */
    private Order load(String orderId) {
        return orderRepo.findByOrderId(orderId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "Order 없음: " + orderId));
    }

    private void assertBrandOwns(Long brandUserNumber, String orderId) {
        boolean owns = paymentRepo.findByOrderId(orderId)
                .map(p -> lineRepo.existsByPayment_IdAndProduct_BrandUser_UserNumber(p.getId(), brandUserNumber))
                .orElse(false);
        if (!owns) throw new AccessDeniedException("해당 주문의 판매 브랜드가 아님");
    }

    private OrderSummaryDto toSummaryDto(Order o) {
        return OrderSummaryDto.builder()
                .orderId(o.getOrderId())
                .buyerUserNumber(o.getUserNumber())
                .status(o.getStatus())
                .originalAmount(o.getOriginalAmount())
                .brandDiscountAmount(o.getBrandDiscountAmount())
                .userExtraDiscountAmount(o.getUserExtraDiscountAmount())
                .finalPayAmount(o.getFinalPayAmount())
                .couponUsedAmount(o.getCouponUsedAmount())
                .walletUsedAmount(o.getWalletUsedAmount())
                .createdAt(o.getCreatedAt())
                .paidAt(o.getPaidAt())
                .deliveredAt(o.getDeliveredAt())
                .confirmedAt(o.getConfirmedAt())
                .build();
    }

    private OrderDetailDto toDetailDto(Order o, Long brandUserFilter) {
        List<PaymentIntentLine> lines = paymentRepo.findByOrderId(o.getOrderId())
                .map(p -> lineRepo.findAllByPayment_Id(p.getId()))
                .orElseGet(List::of);

        var filtered = (brandUserFilter == null)
                ? lines
                : lines.stream().filter(l ->
                Objects.equals(l.getProduct().getBrandUser().getUserNumber(), brandUserFilter)
        ).toList();

        var itemDtos = filtered.stream().map(l ->
                LineItem.builder()
                        .productId(l.getProduct().getProductId())
                        .productName(l.getProduct().getProductName())
                        .size(l.getSize())
                        .color(l.getColor())
                        .quantity(l.getQuantity())
                        .unitPriceAfterBrandDiscount(l.getUnitPriceAfterBrandDiscount())
                        .lineBase(l.getLineBase())
                        .couponDiscount(l.getCouponDiscount())
                        .lineAfterCoupon(l.getLineAfterCoupon())
                        .paymentLineStatus(l.getStatus())
                        .build()
        ).toList();

        // 리뷰 작성 가능(배송완료 + 14일 내 + 주문당 미작성)
        boolean submitted = reviewRepository.existsAnyByUserAndOrderProducts(o.getUserNumber(), o.getOrderId());
        ReviewAvail avail =
                (!submitted
                        && o.getStatus() == OrderStatus.DELIVERED
                        && o.getDeliveredAt() != null
                        && o.getDeliveredAt().isAfter(LocalDateTime.now().minusDays(14)))
                        ? ReviewAvail.WRITABLE
                        : ReviewAvail.NOT_WRITABLE;

        return OrderDetailDto.builder()
                .orderId(o.getOrderId())
                .buyerUserNumber(o.getUserNumber())
                .status(o.getStatus())
                .originalAmount(o.getOriginalAmount())
                .brandDiscountAmount(o.getBrandDiscountAmount())
                .userExtraDiscountAmount(o.getUserExtraDiscountAmount())
                .finalPayAmount(o.getFinalPayAmount())
                .couponUsedAmount(o.getCouponUsedAmount())
                .walletUsedAmount(o.getWalletUsedAmount())
                .recipientName(o.getRecipientName())
                .recipientPhone(o.getRecipientPhone())
                .zipCode(o.getZipCode())
                .addr1(o.getAddr1())
                .addr2(o.getAddr2())
                .shippingMemo(o.getShippingMemo())
                .courierCode(o.getCourierCode())
                .courierName(o.getCourierName())
                .trackingNo(o.getTrackingNo())
                .createdAt(o.getCreatedAt())
                .paidAt(o.getPaidAt())
                .deliveredAt(o.getDeliveredAt())
                .confirmedAt(o.getConfirmedAt())
                .items(itemDtos)
                .reviewAvail(avail)
                .build();
    }
}
