package basilium.basiliumserver.domain.purchaseTransaction;

import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;


@Getter @Setter
@NoArgsConstructor
public class OrderPaymentRequest {
    private String memberId;
    private String orderId;
    private Long price;
    private List<InventoryItem> inventoryList;

    // Getters and Setters

    @Getter @Setter
    @NoArgsConstructor
    public static class InventoryItem {
        private Long productId;
        private String color;
        private String size;
        private Long cnt;

        // Getters and Setters
    }
}
