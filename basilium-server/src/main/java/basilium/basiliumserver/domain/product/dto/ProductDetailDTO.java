package basilium.basiliumserver.domain.product.dto;

import basilium.basiliumserver.domain.product.entity.Material;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailDTO {
    private Long productId;
    private String productName;
    private Long productPrice;
    private String productDesc;
    private List<Material> productMaterials;
    private String categoryName;
    private BrandUserDTO brandUser;
    private Long totalQuantity;
    private List<ProductOptionDTO> productOptions;
    private List<ProductSizeOptionDTO> productSizeOptions;
    private List<ProductColorOptionDTO> productColorOptions;
}
