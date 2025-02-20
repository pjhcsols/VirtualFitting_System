package basilium.basiliumserver.domain.product.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
public class ProductColorOptionUpdateRequest {
    private String productColor;  // Enum 이름 (예: "BLACK")
    private List<String> productPhotoUrls;
    private List<String> productSubPhotoUrls;
}
