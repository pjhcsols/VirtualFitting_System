package basilium.basiliumserver.domain.payment.service;

import basilium.basiliumserver.domain.payment.dto.paymentView.PaymentViewDtos.*;
import basilium.basiliumserver.domain.payment.entity.Payment;
import basilium.basiliumserver.domain.payment.entity.PaymentIntentLine;
import basilium.basiliumserver.domain.payment.entity.PaymentStatus;
import basilium.basiliumserver.domain.payment.repository.PaymentIntentLineRepository;
import basilium.basiliumserver.domain.payment.repository.PaymentRepository;
import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentQueryService {

    private final PaymentRepository paymentRepo;
    private final PaymentIntentLineRepository lineRepo;

    /* ========= 리스트 뷰 ========= */

    public Page<PaymentSummaryDto> listForBuyer(Long buyerUserNumber, Pageable pageable) {
        Page<Payment> page = paymentRepo.findByNormalUser_UserNumberOrderByCreatedAtDesc(buyerUserNumber, pageable);
        return toSummaryPage(page);
    }

    public Page<PaymentSummaryDto> listForBrand(Long brandUserNumber, Pageable pageable) {
        Page<Payment> page = paymentRepo.findPageByBrandUserNumber(brandUserNumber, pageable);
        return toSummaryPage(page);
    }

    public Page<PaymentSummaryDto> listForAdmin(Optional<String> orderId,
                                                Optional<Long> buyerUserNumber,
                                                Optional<Long> brandUserNumber,
                                                Optional<PaymentStatus> status,
                                                Pageable pageable) {
        Page<Payment> page;

        if (orderId.isPresent()) {
            Payment p = paymentRepo.findByOrderId(orderId.get())
                    .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "orderId 없음"));
            page = new PageImpl<>(List.of(p), pageable, 1);
        } else if (buyerUserNumber.isPresent()) {
            page = paymentRepo.findByNormalUser_UserNumberOrderByCreatedAtDesc(buyerUserNumber.get(), pageable);
        } else if (brandUserNumber.isPresent()) {
            page = paymentRepo.findPageByBrandUserNumber(brandUserNumber.get(), pageable);
        } else if (status.isPresent()) {
            page = paymentRepo.findByStatusOrderByCreatedAtDesc(status.get(), pageable);
        } else {
            page = paymentRepo.findAll(PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                    Sort.by(Sort.Direction.DESC, "createdAt")));
        }

        return toSummaryPage(page);
    }

    /* ========= 상세 뷰 ========= */

    public PaymentDetailDto getDetailForNormal(Long authUserNumber, Long paymentId) {
        Payment p = loadPayment(paymentId);
        if (!Objects.equals(p.getNormalUser().getUserNumber(), authUserNumber)) {
            throw new AccessDeniedException("본인 결제만 조회 가능");
        }
        return toDetailDto(p, linesFor(paymentId));
    }

    public PaymentDetailDto getDetailForBrand(Long brandUserNumber, Long paymentId) {
        Payment p = loadPayment(paymentId);
        boolean owns = lineRepo.existsByPayment_IdAndProduct_BrandUser_UserNumber(paymentId, brandUserNumber);
        if (!owns) throw new AccessDeniedException("해당 결제의 판매 브랜드가 아님");
        return toDetailDto(p, linesFor(paymentId));
    }

    public PaymentDetailDto getDetailForAdmin(Long paymentId) {
        Payment p = loadPayment(paymentId);
        return toDetailDto(p, linesFor(paymentId));
    }

    /* ========= 내부 유틸 ========= */

    private Payment loadPayment(Long paymentId) {
        return paymentRepo.findById(paymentId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "Payment 없음: " + paymentId));
    }

    private List<PaymentIntentLine> linesFor(Long paymentId) {
        return lineRepo.findAllByPayment_Id(paymentId);
    }

    private Page<PaymentSummaryDto> toSummaryPage(Page<Payment> page) {
        List<Long> ids = page.getContent().stream().map(Payment::getId).toList();
        Map<Long, List<PaymentIntentLine>> linesByPaymentId = lineRepo.findAllByPayment_IdIn(ids)
                .stream().collect(Collectors.groupingBy(l -> l.getPayment().getId()));

        List<PaymentSummaryDto> mapped = page.getContent().stream()
                .map(p -> toSummaryDto(p, linesByPaymentId.getOrDefault(p.getId(), List.of())))
                .toList();

        return new PageImpl<>(mapped, page.getPageable(), page.getTotalElements());
    }

    private PaymentSummaryDto toSummaryDto(Payment p, List<PaymentIntentLine> lines) {
        List<ItemSummary> items = lines.stream().map(l ->
                ItemSummary.builder()
                        .productId(l.getProduct().getProductId())
                        .productName(l.getProduct().getProductName())
                        .size(l.getSize())
                        .color(l.getColor())
                        .quantity(l.getQuantity())
                        .status(l.getStatus())
                        .build()
        ).toList();

        return PaymentSummaryDto.builder()
                .paymentId(p.getId())
                .orderId(p.getOrderId())
                .buyerUserNumber(p.getNormalUser().getUserNumber())
                .status(p.getStatus())
                .currency(p.getCurrency())
                .intentExpiresAt(p.getIntentExpiresAt())
                .amount(p.getAmount())
                .refundedAmountTotal(p.getRefundedAmountTotal())
                .createdAt(p.getCreatedAt())
                .approvedAt(p.getApprovedAt())
                .items(items)
                .build();
    }

    private PaymentDetailDto toDetailDto(Payment p, List<PaymentIntentLine> lines) {
        var lineDtos = lines.stream().map(l ->
                LineDetailDto.builder()
                        .lineId(l.getId())
                        .productId(l.getProduct().getProductId())
                        .productName(l.getProduct().getProductName())
                        .size(l.getSize())
                        .color(l.getColor())
                        .quantity(l.getQuantity())
                        .unitPriceAfterBrandDiscount(l.getUnitPriceAfterBrandDiscount())
                        .lineBase(l.getLineBase())
                        .couponWalletId(l.getCouponWalletId())
                        .couponDiscount(l.getCouponDiscount())
                        .lineAfterCoupon(l.getLineAfterCoupon())
                        .plannedAllocatedPoint(l.getPlannedAllocatedPoint())
                        .finalLinePayable(l.getFinalLinePayable())
                        .reserveTaskId(l.getReserveTaskId())
                        .status(l.getStatus())
                        .createdAt(l.getCreatedAt())
                        .approvedAt(l.getApprovedAt())
                        .build()
        ).toList();

        return PaymentDetailDto.builder()
                .paymentId(p.getId())
                .orderId(p.getOrderId())
                .buyerUserNumber(p.getNormalUser().getUserNumber())
                .status(p.getStatus())
                .currency(p.getCurrency())
                .intentExpiresAt(p.getIntentExpiresAt())
                .pointsToUse(p.getPointsToUse())
                .amount(p.getAmount())
                .refundedAmountTotal(p.getRefundedAmountTotal())
                .paymentKey(p.getPaymentKey())
                .paymentType(p.getPaymentType())
                .pgErrorCode(p.getPgErrorCode())
                .pgErrorMessage(p.getPgErrorMessage())
                .createdAt(p.getCreatedAt())
                .approvedAt(p.getApprovedAt())
                .callbackReceivedAt(p.getCallbackReceivedAt())
                .lines(lineDtos)
                .build();
    }
}
