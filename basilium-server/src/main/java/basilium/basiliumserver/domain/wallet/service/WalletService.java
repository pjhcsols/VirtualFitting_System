// src/main/java/basilium/basiliumserver/domain/wallet/service/WalletService.java
package basilium.basiliumserver.domain.wallet.service;

import basilium.basiliumserver.domain.payment.entity.Payment;
import basilium.basiliumserver.domain.payment.entity.PaymentStatus;
import basilium.basiliumserver.domain.payment.repository.PaymentReadRepository;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import basilium.basiliumserver.domain.user.repository.NormalUserRepository;
import basilium.basiliumserver.domain.wallet.dto.WalletDtos.*;
import basilium.basiliumserver.domain.wallet.entity.*;
import basilium.basiliumserver.domain.wallet.repository.*;
import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class WalletService {

    private final WalletRepository walletRepo;
    private final WalletLedgerRepository ledgerRepo;
    private final NormalUserRepository normalUserRepo;
    private final PaymentReadRepository paymentReadRepo;

    /* ===== 내부 유틸 ===== */

    private NormalUser findUserByAuthIdOrThrow(String authUserId) {
        return normalUserRepo.findById(authUserId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.MEMBER_NOT_FOUND, "일반 유저를 찾을 수 없습니다: " + authUserId));
    }

    private NormalUser findUserOrThrow(Long userNumber) {
        return normalUserRepo.findById(userNumber)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.MEMBER_NOT_FOUND, "대상 유저 없음: " + userNumber));
    }

    private long percentOf(long base, int percent) {
        if (base <= 0 || percent <= 0) return 0L;
        return BigDecimal.valueOf(base)
                .multiply(BigDecimal.valueOf(percent).divide(BigDecimal.valueOf(100)))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();
    }

    private Wallet getOrCreateWallet(NormalUser user) {
        return walletRepo.findByUserNumber(user.getUserNumber())
                .orElseGet(() -> walletRepo.save(
                        Wallet.builder()
                                .user(user)
                                .userNumber(user.getUserNumber())
                                .balance(0L)
                                .build()
                ));
    }

    /* ===== 조회 ===== */

    /** 내 지갑 요약 */
    public BalanceResponse myBalance(String authUserId) {
        NormalUser me = findUserByAuthIdOrThrow(authUserId);
        Wallet w = walletRepo.findByUserNumber(me.getUserNumber())
                .orElseGet(() -> Wallet.builder()
                        .user(me).userNumber(me.getUserNumber()).balance(0L).build());
        return BalanceResponse.builder()
                .userNumber(me.getUserNumber())
                .balance(w.getBalance())
                .updatedAt(Optional.ofNullable(w.getUpdatedAt()).orElse(LocalDateTime.now()))
                .build();
    }

    /** 내 원장 페이지 */
    public Page<LedgerItem> myLedger(String authUserId, Pageable pageable) {
        NormalUser me = findUserByAuthIdOrThrow(authUserId);
        Page<WalletLedger> page = ledgerRepo.findByUser_UserNumberOrderByCreatedAtDesc(me.getUserNumber(), pageable);
        return page.map(l -> LedgerItem.builder()
                .id(l.getId())
                .type(l.getType())
                .refType(l.getRefType())
                .refId(l.getRefId())
                .amount(l.getAmount())
                .balanceAfter(l.getBalanceAfter())
                .uniqueKey(l.getUniqueKey())
                .createdAt(l.getCreatedAt())
                .build());
    }

    /* ===== 핵심: 멱등 CREDIT/DEBIT ===== */

    /**
     * /* 기능 설명 * /
     * 지갑 적립(CREDIT) — 멱등(uniqueKey), 낙관잠금 재시도(최대 3회), 원장 기록
     */
    @Transactional
    public long credit(Long userNumber, long amount, WalletLedgerRefType refType, String refId, String uniqueKey) {
        if (amount <= 0) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "amount > 0");
        if (uniqueKey == null || uniqueKey.isBlank()) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "uniqueKey 필수");

        boolean exists = ledgerRepo.existsByUniqueKey(uniqueKey);
        if (exists) {
            Wallet w = walletRepo.findByUserNumber(userNumber)
                    .orElseGet(() -> Wallet.builder().user(findUserOrThrow(userNumber)).userNumber(userNumber).balance(0L).build());
            return w.getBalance();
        }

        NormalUser user = findUserOrThrow(userNumber);
        int tries = 0;
        while (true) {
            tries++;
            Wallet w = getOrCreateWallet(user);
            w.increase(amount);
            try {
                Wallet saved = walletRepo.saveAndFlush(w);
                ledgerRepo.save(WalletLedger.builder()
                        .user(user)
                        .type(WalletLedgerType.CREDIT)
                        .refType(refType)
                        .refId(refId)
                        .amount(amount)
                        .balanceAfter(saved.getBalance())
                        .uniqueKey(uniqueKey)
                        .build());
                return saved.getBalance();
            } catch (OptimisticLockingFailureException e) {
                if (tries >= 3) throw new BasiliumCustomException(ErrorCode.CONFLICT, "지갑 갱신 충돌");
            }
        }
    }

    /**
     * /* 기능 설명 * /
     * 지갑 차감(DEBIT) — 멱등(uniqueKey), 잔액 검증, 낙관잠금 재시도(최대 3회), 원장 기록
     */
    @Transactional
    public long debit(Long userNumber, long amount, WalletLedgerRefType refType, String refId, String uniqueKey) {
        if (amount <= 0) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "amount > 0");
        if (uniqueKey == null || uniqueKey.isBlank()) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "uniqueKey 필수");

        boolean exists = ledgerRepo.existsByUniqueKey(uniqueKey);
        if (exists) {
            Wallet w = walletRepo.findByUserNumber(userNumber)
                    .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "지갑 없음"));
            return w.getBalance();
        }

        NormalUser user = findUserOrThrow(userNumber);
        int tries = 0;
        while (true) {
            tries++;
            Wallet w = getOrCreateWallet(user);
            if (w.getBalance() < amount) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "잔액 부족");
            w.decrease(amount);
            try {
                Wallet saved = walletRepo.saveAndFlush(w);
                ledgerRepo.save(WalletLedger.builder()
                        .user(user)
                        .type(WalletLedgerType.DEBIT)
                        .refType(refType)
                        .refId(refId)
                        .amount(amount)
                        .balanceAfter(saved.getBalance())
                        .uniqueKey(uniqueKey)
                        .build());
                return saved.getBalance();
            } catch (OptimisticLockingFailureException e) {
                if (tries >= 3) throw new BasiliumCustomException(ErrorCode.CONFLICT, "지갑 갱신 충돌");
            }
        }
    }

    /* ===== 도메인 응용 시나리오 ===== */

    /**
     * /* 기능 설명 * /
     * (리뷰 작성) 결제 라인 금액의 10% 적립 — 멱등키: REVIEW:{paymentId}
     */
    @Transactional
    public long creditByReview(String authUserId, Long paymentId) {
        NormalUser me = findUserByAuthIdOrThrow(authUserId);
        Payment p = paymentReadRepo.findByIdAndStatus(paymentId, PaymentStatus.APPROVED)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "결제 내역 없음 또는 승인 상태 아님"));

        if (!Objects.equals(p.getNormalUser().getUserNumber(), me.getUserNumber()))
            throw new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "본인 결제 내역이 아닙니다.");

        long base = Optional.ofNullable(p.getAmount()).orElse(0L);
        long creditAmt = percentOf(base, 10);
        if (creditAmt <= 0) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "적립할 금액이 없습니다.");

        String uk = "REVIEW:" + paymentId;
        return credit(me.getUserNumber(), creditAmt, WalletLedgerRefType.REVIEW, String.valueOf(paymentId), uk);
    }

    /**
     * /* 기능 설명 * /
     * (구매 확정) 주문 순수 결제 합계의 2% 적립 — 멱등키: ORDER_CONFIRMED:{orderId}
     *  - 순수 합계 = 승인금액 합 - 환불집계
     */
    @Transactional
    public long creditOnOrderConfirmed(String orderId) {
        if (orderId == null || orderId.isBlank())
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "orderId 필수");

        Long userNumber = paymentReadRepo.findAnyUserNumberByOrderId(orderId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "주문 소유자를 찾을 수 없습니다."));
        Long net = Optional.ofNullable(paymentReadRepo.sumNetApprovedAmountByOrderId(orderId)).orElse(0L);
        long creditAmt = percentOf(net, 2);
        if (creditAmt <= 0) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "적립할 금액이 없습니다.");

        String uk = "ORDER_CONFIRMED:" + orderId;
        return credit(userNumber, creditAmt, WalletLedgerRefType.ORDER_CONFIRMED, orderId, uk);
    }

    /**
     * /* 기능 설명 * /
     * (결제 성공) 포인트 차감 — 멱등키: PAYMENT:{orderId}
     *  - Payment 성공 콜백 흐름에서 호출
     *  - 쿠폰과 동시 사용 가능(각각 1회), 포인트는 지정 금액만큼 차감
     */
    @Transactional
    public long debitOnPaymentApproved(String authUserId, String orderId, long amount) {
        NormalUser me = findUserByAuthIdOrThrow(authUserId);
        if (amount <= 0) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "amount > 0");

        // 주문 소유 검증(결제 라인 중 하나라도 나여야 함)
        Optional<Long> ownerOpt = paymentReadRepo.findAnyUserNumberByOrderId(orderId);
        if (ownerOpt.isPresent() && !Objects.equals(ownerOpt.get(), me.getUserNumber()))
            throw new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "본인 주문이 아닙니다.");

        String uk = "PAYMENT:" + orderId;
        return debit(me.getUserNumber(), amount, WalletLedgerRefType.PAYMENT, orderId, uk);
    }
}
