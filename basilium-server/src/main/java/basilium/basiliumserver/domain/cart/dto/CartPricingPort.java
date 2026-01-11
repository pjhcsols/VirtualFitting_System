// src/main/java/basilium/basiliumserver/domain/cart/dto/CartPricingPort.java
package basilium.basiliumserver.domain.cart.dto;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.util.List;
/*
public interface CartPricingPort {

    CartDtos.TotalsView estimateTotals(String userId, List<CartLine> lines);

    /** 합계 계산에 필요한 6필드 최소 정보 */
/*
    record CartLine(Long productId, String size, String color, Long quantity, Long brandUserNumber) {}

    @Primary
    @Component
    class NoOpCartPricing implements CartPricingPort {
        @Override public CartDtos.TotalsView estimateTotals(String userId, List<CartLine> lines) {
            long original = 0L;
            return new CartDtos.TotalsView(original, 0L, 0L, original);
        }
    }
}


 */