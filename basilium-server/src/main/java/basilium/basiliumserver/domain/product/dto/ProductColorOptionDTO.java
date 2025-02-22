package basilium.basiliumserver.domain.product.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ProductColorOptionDTO {
    private String productColor;  // Enum 이름 (예: "BLACK")
    private List<String> productPhotoUrls;
    private List<String> productSubPhotoUrls;
}
