package basilium.basiliumserver.domain.product.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ProductImageDTO {
    private String productColor;
    private List<String> productPhotoUrls;
    private List<String> productSubPhotoUrls;
}
