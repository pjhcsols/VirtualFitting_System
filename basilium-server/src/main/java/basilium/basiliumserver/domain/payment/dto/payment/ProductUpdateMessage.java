// src/main/java/basilium/basiliumserver/domain/payment/dto/payment/ProductUpdateMessage.java
package basilium.basiliumserver.domain.payment.dto.payment;

import basilium.basiliumserver.domain.product.entity.Color;
import basilium.basiliumserver.domain.product.entity.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 단건 재고 차감 메시지 (RID 포함) */
@Data @NoArgsConstructor @AllArgsConstructor
public class ProductUpdateMessage {
    private String reserveTaskOrderPayId; // RID
    private String userId;
    private Long productId;
    private Long count;
    private Size productSize;
    private Color productColor;
}
