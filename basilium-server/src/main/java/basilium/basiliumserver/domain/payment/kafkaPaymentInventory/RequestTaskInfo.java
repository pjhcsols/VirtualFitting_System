package basilium.basiliumserver.domain.payment.kafkaPaymentInventory;

import basilium.basiliumserver.domain.product.entity.Color;
import basilium.basiliumserver.domain.product.entity.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@ToString
public class RequestTaskInfo {
    private String userId;
    private Long productId;
    private Long count;
    private Size productSize;
    private Color productColor;
}