// src/main/java/basilium/basiliumserver/domain/payment/service/PaymentCommandService.java
package basilium.basiliumserver.domain.payment.service;

import basilium.basiliumserver.domain.coupon.entity.NormalCouponWalletStatus;
import basilium.basiliumserver.domain.coupon.repository.NormalCouponWalletRepository;
import basilium.basiliumserver.domain.order.service.OrderService;
import basilium.basiliumserver.domain.payment.entity.Payment;
import basilium.basiliumserver.domain.payment.entity.PaymentIntentLine;
import basilium.basiliumserver.domain.payment.entity.PaymentStatus;
import basilium.basiliumserver.domain.payment.repository.PaymentIntentLineRepository;
import basilium.basiliumserver.domain.payment.repository.PaymentRepository;
import basilium.basiliumserver.domain.product.entity.Product;
import basilium.basiliumserver.domain.product.repository.ProductRepository;
import basilium.basiliumserver.domain.discount.repository.ProductDiscountRepository;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import basilium.basiliumserver.domain.user.repository.NormalUserRepository;
import basilium.basiliumserver.domain.wallet.service.WalletService;
import basilium.basiliumserver.domain.wallet.entity.WalletLedgerRefType;
import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PaymentCommandService {

    private final PaymentRepository paymentRepo;
    private final PaymentIntentLineRepository lineRepo;

    private final NormalUserRepository normalUserRepo;
    private final ProductRepository productRepo;
    private final ProductDiscountRepository productDiscountRepo;

    private final NormalCouponWalletRepository couponWalletRepo;
    private final WalletService walletService; // 지갑 차감(승인 시)
    private final OrderService orderService;

    /* ===== 유틸 ===== */

    private static long roundPercent(long base, int percent) {
        if (base <= 0 || percent <= 0) return 0L;
        return BigDecimal.valueOf(base)
                .multiply(BigDecimal.valueOf(percent).divide(BigDecimal.valueOf(100)))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();
    }

    private static long cap(Long value, Long cap) {
        if (value <= 0) return 0L;
        if (cap == null) return value;
        return Math.min(value, cap);
    }

    /* ===== DTO (요청/응답) ===== */

    @lombok.Getter @lombok.Setter @lombok.NoArgsConstructor @lombok.AllArgsConstructor @lombok.Builder
    public static class CreateIntentLine {
        private Long productId;
        private String size;
        private String color;
        private Long quantity;
        private Long couponWalletId; // 선택
    }

    @lombok.Getter @lombok.Setter @lombok.NoArgsConstructor @lombok.AllArgsConstructor @lombok.Builder
    public static class CreateIntentRequest {
        private String orderId;
        private String currency;           // ex. KRW
        private Long pointsToUse;          // 0 이상
        private List<CreateIntentLine> lines;
        private LocalDateTime expiresAt;   // 재고 예약 TTL과 동일 시간
    }

    @lombok.Getter @lombok.Setter @lombok.NoArgsConstructor @lombok.AllArgsConstructor @lombok.Builder
    public static class CreateIntentResponse {
        private Long paymentId;
        private String orderId;
        private Long serverTotal;   // 모든 라인 lineAfterCoupon 합
        private Long pointsToUse;
        private Long pgAmount;      // serverTotal - pointsToUse
        private LocalDateTime intentExpiresAt;
    }

    /* ===== 1) 결제 의도 생성 (INIT) ===== */
    @Transactional
    public CreateIntentResponse createIntent(String authUserId, CreateIntentRequest req) {
        if (req.getLines() == null || req.getLines().isEmpty())
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "lines 필수");
        if (req.getPointsToUse() == null || req.getPointsToUse() < 0)
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "pointsToUse >= 0");
        if (req.getCurrency() == null || req.getCurrency().isBlank())
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "currency 필수");
        if (req.getOrderId() == null || req.getOrderId().isBlank())
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "orderId 필수");

        NormalUser me = normalUserRepo.findById(authUserId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.MEMBER_NOT_FOUND, "일반 유저를 찾을 수 없습니다: " + authUserId));

        /*
        long couponLines = req.getLines().stream()
                .map(CreateIntentLine::getCouponWalletId)
                .filter(java.util.Objects::nonNull)
                .count();
        if (couponLines > 1) {
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "주문당 쿠폰은 1개만 사용할 수 있습니다.");
        }
         */


        // 동시요청 경쟁 최소화를 위해 먼저 존재여부 체크 (UNIQUE 위반은 전역 핸들러가 CONFLICT로 나가게 유지)
        paymentRepo.findByOrderId(req.getOrderId()).ifPresent(p -> {
            throw new BasiliumCustomException(ErrorCode.CONFLICT, "이미 존재하는 orderId");
        });

        LocalDateTime expiresAt = Optional.ofNullable(req.getExpiresAt())
                .orElse(LocalDateTime.now().plusMinutes(5));

        // ===== 1) 모든 라인의 가격/쿠폰을 "사전 계산" =====
        record LineCalc(Product product, String size, String color,
                        long qty, long unitAfterBrand, long lineBase,
                        Long couponWalletId, long couponDiscount, long lineAfterCoupon) {}

        List<LineCalc> calcs = new ArrayList<>(req.getLines().size());
        long serverTotal = 0L;

        for (CreateIntentLine in : req.getLines()) {
            Product p = productRepo.findById(in.getProductId())
                    .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "상품 없음: " + in.getProductId()));

            long qty = Optional.ofNullable(in.getQuantity()).orElse(0L);
            if (qty <= 0) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "qty > 0");

            long base = Optional.ofNullable(p.getProductPrice()).orElse(0L);
            int brandPercent = productDiscountRepo.findActivePercentNow(p.getProductId(), LocalDateTime.now()).orElse(0);
            long unitAfterBrand = base - roundPercent(base, brandPercent);
            long lineBase = unitAfterBrand * qty;

            Long couponWalletId = in.getCouponWalletId();
            long couponDiscount = 0L;
            if (couponWalletId != null) {
                var wallet = couponWalletRepo.findByIdAndUser_UserNumber(couponWalletId, me.getUserNumber())
                        .orElseThrow(() -> new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "쿠폰 소유권 아님/존재하지 않음"));
                if (wallet.getStatus() != NormalCouponWalletStatus.AVAILABLE)
                    throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "쿠폰 사용 불가 상태");

                var c = wallet.getCampaign();
                boolean match =
                        (c.getScope() == basilium.basiliumserver.domain.coupon.entity.BrandCouponScope.BRAND
                                && Objects.equals(p.getBrandUser().getUserNumber(), c.getBrandUserNumber()))
                                || (c.getScope() == basilium.basiliumserver.domain.coupon.entity.BrandCouponScope.PRODUCT
                                && c.getProduct() != null
                                && Objects.equals(c.getProduct().getProductId(), p.getProductId()));

                if (match && (c.getMinOrderPrice() == null || lineBase >= c.getMinOrderPrice())) {
                    long raw = roundPercent(lineBase, c.getPercent());
                    couponDiscount = cap(raw, c.getMaxDiscountPrice());
                }
            }

            long lineAfterCoupon = Math.max(0L, lineBase - couponDiscount);
            calcs.add(new LineCalc(
                    p, in.getSize(), in.getColor(),
                    qty, unitAfterBrand, lineBase,
                    couponWalletId, couponDiscount, lineAfterCoupon
            ));
            serverTotal += lineAfterCoupon;
        }

        long pgAmount = Math.max(0L, serverTotal - req.getPointsToUse());

        // ===== 2) Payment를 "단 1회" 저장 (amount=serverTotal) =====
        Payment payment = paymentRepo.save(
                Payment.initIntent(req.getOrderId(), me, req.getCurrency(),
                        req.getPointsToUse(), serverTotal, expiresAt)
        );

        // ===== 3) 사전 계산값으로 PaymentIntentLine 배치 저장 =====
        List<PaymentIntentLine> lines = new ArrayList<>(calcs.size());
        for (LineCalc c : calcs) {
            lines.add(PaymentIntentLine.initLine(
                    payment,
                    c.product(), c.size(), c.color(),
                    c.qty(), c.unitAfterBrand(), c.lineBase(),
                    c.couponWalletId(), c.couponDiscount(), c.lineAfterCoupon()
            ));
        }
        lineRepo.saveAll(lines);

        // ===== 4) 응답 =====
        return CreateIntentResponse.builder()
                .paymentId(payment.getId())
                .orderId(payment.getOrderId())
                .serverTotal(serverTotal)
                .pointsToUse(req.getPointsToUse())
                .pgAmount(pgAmount)
                .intentExpiresAt(expiresAt)
                .build();
    }


    /* ===== 2) 결제 성공(승인) 처리 ===== */
    @Transactional
    public void approve(String orderId, String paymentKey, String paymentType, long pgAmountFromPg) {
        Payment payment = paymentRepo.findByOrderId(orderId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "Payment 없음: " + orderId));

        if (payment.getStatus() != PaymentStatus.INIT)
            throw new BasiliumCustomException(ErrorCode.CONFLICT, "승인 가능한 상태가 아님");

        // NORMAL 호출 경로면 소유자 검증(서버-서버 HMAC 경로는 ROLE_NORMAL이 아님)
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        boolean isNormal = auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_NORMAL"));
        if (isNormal) {
            //String principal = auth.getName();
            String principal = String.valueOf(auth.getPrincipal());
            if (!String.valueOf(payment.getNormalUser().getId()).equals(principal)) {
                throw new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "본인 결제가 아닙니다.");
            }
        }

        List<PaymentIntentLine> lines = lineRepo.findAllByOrderId(orderId);
        if (lines.isEmpty())
            throw new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "라인 없음");

        long serverTotal = lines.stream().mapToLong(PaymentIntentLine::getFinalLinePayable).sum();
        long serverPgAmount = Math.max(0L, serverTotal - payment.getPointsToUse());
        if (pgAmountFromPg != serverPgAmount) {
            payment.failInit("AMOUNT_MISMATCH", "PG금액과 서버금액 불일치");
            paymentRepo.save(payment);
            throw new BasiliumCustomException(ErrorCode.CONFLICT, "금액 불일치");
        }

        // ① 포인트 선 차감(멱등) — 실패 시 전체 트랜잭션 롤백 → Payment는 APPROVE 되지 않음
        long points = java.util.Optional.ofNullable(payment.getPointsToUse()).orElse(0L);
        if (points > 0) {
            String uk = "PAYMENT:" + payment.getOrderId();
            walletService.debit(payment.getNormalUser().getUserNumber(), points,
                    WalletLedgerRefType.PAYMENT, payment.getOrderId(), uk);
        }

        // ② 라인 APPROVE
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        for (PaymentIntentLine l : lines) {
            if (l.getStatus() == PaymentStatus.INIT) l.approve(l.getFinalLinePayable(), now);
        }
        lineRepo.saveAll(lines);

        // ③ 쿠폰 USED 확정 (라인당 1개 최대 — createIntent에서 주문당 1개로 더 강하게 막음)
        for (PaymentIntentLine l : lines) {
            Long walletId = l.getCouponWalletId();
            if (walletId == null) continue;
            int updated = couponWalletRepo.consumeAvailable(walletId, payment.getOrderId());
            if (updated != 1)
                throw new BasiliumCustomException(ErrorCode.CONFLICT, "쿠폰 이미 사용됨/상태 불일치");
        }

        // ④ Payment APPROVE
        payment.approve(paymentKey, paymentType, serverPgAmount, now);
        paymentRepo.save(payment);
        orderService.createFromApprovedPayment(orderId);
    }
    /*
    @Transactional
    public void approve(String orderId, String paymentKey, String paymentType, long pgAmountFromPg) {
        Payment payment = paymentRepo.findByOrderId(orderId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "Payment 없음: " + orderId));

        if (payment.getStatus() != PaymentStatus.INIT)
            throw new BasiliumCustomException(ErrorCode.CONFLICT, "승인 가능한 상태가 아님");

        List<PaymentIntentLine> lines = lineRepo.findAllByOrderId(orderId);
        if (lines.isEmpty())
            throw new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "라인 없음");

        long serverTotal = lines.stream().mapToLong(PaymentIntentLine::getFinalLinePayable).sum();
        long serverPgAmount = Math.max(0L, serverTotal - payment.getPointsToUse());

        if (pgAmountFromPg != serverPgAmount) {
            // 금액 불일치 → 승인 거부(또는 실패 기록 후 복구)
            payment.failInit("AMOUNT_MISMATCH", "PG금액과 서버금액 불일치");
            paymentRepo.save(payment);
            throw new BasiliumCustomException(ErrorCode.CONFLICT, "금액 불일치");
        }

        LocalDateTime now = LocalDateTime.now();

        for (PaymentIntentLine l : lines) {
            if (l.getStatus() == PaymentStatus.INIT) l.approve(l.getFinalLinePayable(), now);
        }
        lineRepo.saveAll(lines);

        payment.approve(paymentKey, paymentType, serverPgAmount, now);
        paymentRepo.save(payment);

        // 1) 포인트 차감
        long points = Optional.ofNullable(payment.getPointsToUse()).orElse(0L);
        if (points > 0) {
            String uk = "PAYMENT:" + payment.getOrderId();
            walletService.debit(payment.getNormalUser().getUserNumber(), points,
                    WalletLedgerRefType.PAYMENT, payment.getOrderId(), uk);
        }

        // 2) 쿠폰 USED 확정 (라인당 1개 최대)
        // PaymentCommandService.approve() 쿠폰 처리 부분
        for (PaymentIntentLine l : lines) {
            Optional.ofNullable(l.getCouponWalletId()).ifPresent(walletId -> {
                var owned = couponWalletRepo.findByIdAndUser_UserNumber(walletId, payment.getNormalUser().getUserNumber())
                        .orElseThrow(() -> new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "쿠폰 소유권 아님"));
                int updated = couponWalletRepo.consumeAvailable(walletId, payment.getOrderId());
                if (updated != 1) {
                    throw new BasiliumCustomException(ErrorCode.CONFLICT, "쿠폰 이미 사용됨/상태 불일치");
                }
            });
        }
        // (예약 취소는 카프카 예약 서비스의 /payment/response(true)에서 처리)
    }

     */

    /* ===== 3) 결제 실패 처리 ===== */
    @Transactional
    public void fail(String orderId, String code, String message) {
        Payment payment = paymentRepo.findByOrderId(orderId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "Payment 없음: " + orderId));

        if (payment.getStatus() == PaymentStatus.APPROVED) return; // 이미 성공이면 무시(안전망)

        // 라인 취소 (INIT → CANCELLED)
        lineRepo.updateStatusByOrderIdIfMatch(orderId, PaymentStatus.INIT, PaymentStatus.CANCELLED);

        // Payment 실패 기록
        payment.failInit(code, message);
        paymentRepo.save(payment);

        // 재고 복구는 카프카 예약 서비스의 /payment/response(false)에서 실행
    }
}
