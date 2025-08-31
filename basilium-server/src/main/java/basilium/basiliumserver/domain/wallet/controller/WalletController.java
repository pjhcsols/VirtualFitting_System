// src/main/java/basilium/basiliumserver/domain/wallet/controller/WalletController.java
package basilium.basiliumserver.domain.wallet.controller;

import basilium.basiliumserver.domain.wallet.dto.WalletDtos.*;
import basilium.basiliumserver.domain.wallet.service.WalletService;
import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.auth.support.AuthUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * WalletController
 * - 내 지갑 요약/원장 조회
 * - 리뷰 적립(10%), 구매확정 적립(2%), 결제 차감(멱등)
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/b1/wallets")
public class WalletController{

    private final WalletService service;

    /* ===== 조회 ===== */

    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<BalanceResponse>> myBalance(@AuthUser String authUserId) {
        var resp = service.myBalance(authUserId);
        return ResponseEntity.ok(ApiResponse.success(resp));
    }

    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    @GetMapping("/me/ledger")
    public ResponseEntity<ApiResponse<Page<LedgerItem>>> myLedger(
            @AuthUser String authUserId, Pageable pageable) {
        var page = service.myLedger(authUserId, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    /* ===== 도메인 이벤트 ===== */

    /* 리뷰 작성 적립 10% (멱등: REVIEW:{paymentId}) */
    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    @PostMapping("/credits/review")
    public ResponseEntity<ApiResponse<BalanceResponse>> creditByReview(
            @AuthUser String authUserId, @RequestBody CreditReviewRequest req) {
        long balance = service.creditByReview(authUserId, req.getPaymentId());
        return ResponseEntity.ok(ApiResponse.success(
                BalanceResponse.builder().balance(balance).build()
        ));
    }

    /* 주문 구매확정 적립 2% (멱등: ORDER_CONFIRMED:{orderId}) */
    @PreAuthorize("hasAnyRole('NORMAL','ADMIN','SUPER')")
    @PostMapping("/credits/order-confirmed")
    public ResponseEntity<ApiResponse<BalanceResponse>> creditOnOrderConfirmed(
            @RequestBody CreditOrderConfirmedRequest req) {
        long balance = service.creditOnOrderConfirmed(req.getOrderId());
        return ResponseEntity.ok(ApiResponse.success(
                BalanceResponse.builder().balance(balance).build()
        ));
    }

    /* 결제 성공 차감 (멱등: PAYMENT:{orderId}) */
    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    @PostMapping("/debits/payment")
    public ResponseEntity<ApiResponse<BalanceResponse>> debitOnPaymentApproved(
            @AuthUser String authUserId, @RequestBody DebitRequest req) {
        long balance = service.debitOnPaymentApproved(authUserId, req.getOrderId(), req.getAmount());
        return ResponseEntity.ok(ApiResponse.success(
                BalanceResponse.builder().balance(balance).build()
        ));
    }
}
