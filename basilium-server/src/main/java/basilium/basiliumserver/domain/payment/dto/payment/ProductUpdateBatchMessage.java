// src/main/java/basilium/basiliumserver/domain/payment/dto/payment/ProductUpdateBatchMessage.java
package basilium.basiliumserver.domain.payment.dto.payment;

import basilium.basiliumserver.domain.product.entity.Color;
import basilium.basiliumserver.domain.product.entity.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Optional;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductUpdateBatchMessage {
    private String reserveTaskOrderPayId; // RID
    private String userId;
    private List<Item> items;

    // 항상 non-null
    public List<Item> getItems() {
        return Optional.ofNullable(items).orElseGet(List::of);
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class Item {
        private Long productId;
        private Long count;
        private Size productSize;
        private Color productColor;
    }
}
