// src/main/java/basilium/basiliumserver/domain/cart/integration/CartCleanupOnOrderAspect.java
package basilium.basiliumserver.domain.cart.integration;

import basilium.basiliumserver.domain.cart.service.CartService;
import basilium.basiliumserver.domain.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

/**
 * 결제 승인 기반 주문 생성 직후 장바구니 자동 삭제.
 * OrderService 변경 없이 AOP로 연동합니다.
 * - 결제 취소/실패 시에는 OrderService.createFromApprovedPayment가 호출되지 않으므로 장바구니 유지(자동 복구 성립).
 */
/*
@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class CartCleanupOnOrderAspect {

    private final PaymentRepository paymentRepo;
    private final CartService cartService;

    @AfterReturning(
            pointcut = "execution(* basilium.basiliumserver.domain.order.service.OrderService.createFromApprovedPayment(..)) && args(orderId)"
    )
    public void clearCartAfterOrder(String orderId) {
        try {
            paymentRepo.findByOrderId(orderId)
                    .map(p -> p.getNormalUser().getUserNumber())
                    .ifPresent(cartService::clearAll);
        } catch (Exception ex) {
            log.warn("[Cart][AOP] cleanup failed orderId={} ex={}", orderId, ex.toString(), ex);
        }
    }
}


 */