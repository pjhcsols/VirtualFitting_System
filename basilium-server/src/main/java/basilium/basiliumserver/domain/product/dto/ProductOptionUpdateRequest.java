package basilium.basiliumserver.domain.product.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ProductOptionUpdateRequest {
    private String productSize;   // Enum 이름 (예: "M")
    private String productColor;  // Enum 이름 (예: "BLACK")
    private Long optionQuantity;
}
