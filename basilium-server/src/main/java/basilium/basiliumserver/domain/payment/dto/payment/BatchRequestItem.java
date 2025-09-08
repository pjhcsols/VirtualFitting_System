// src/main/java/basilium/basiliumserver/domain/payment/dto/payment/BatchRequestItem.java
package basilium.basiliumserver.domain.payment.dto.payment;

import basilium.basiliumserver.domain.product.entity.Color;
import basilium.basiliumserver.domain.product.entity.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter @NoArgsConstructor @AllArgsConstructor
public class BatchRequestItem {
    private Long productId;
    private Long count;
    private Size productSize;
    private Color productColor;
}
