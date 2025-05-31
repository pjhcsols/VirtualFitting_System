package basilium.basiliumserver.domain.product.dto;

import basilium.basiliumserver.domain.product.entity.Material;
import basilium.basiliumserver.domain.product.entity.ProductStatus;

import java.util.List;

public class ProductEditDTO {
    private final Long productId;
    private final String productName;
    private final Long productPrice;
    private final String productDesc;
    private final ProductStatus status;
    private final Long categoryId;
    private final List<Material> productMaterial;
    private final List<ProductSizeOptionDTO> productSizeOptions;
    private final List<ProductOptionDTO> productOptions;
    private final List<ProductColorOptionDTO> productColorOptions;

    public ProductEditDTO(Long productId,
                          String productName,
                          Long productPrice,
                          String productDesc,
                          ProductStatus status,
                          Long categoryId,
                          List<Material> productMaterial,
                          List<ProductSizeOptionDTO> productSizeOptions,
                          List<ProductOptionDTO> productOptions,
                          List<ProductColorOptionDTO> productColorOptions) {
        this.productId = productId;
        this.productName = productName;
        this.productPrice = productPrice;
        this.productDesc = productDesc;
        this.status = status;
        this.categoryId = categoryId;
        this.productMaterial = productMaterial;
        this.productSizeOptions = productSizeOptions;
        this.productOptions = productOptions;
        this.productColorOptions = productColorOptions;
    }

    public Long getProductId() {
        return productId;
    }
    public String getProductName() {
        return productName;
    }
    public Long getProductPrice() {
        return productPrice;
    }
    public String getProductDesc() {
        return productDesc;
    }
    public ProductStatus getStatus() {
        return status;
    }
    public Long getCategoryId() {
        return categoryId;
    }
    public List<Material> getProductMaterial() {
        return productMaterial;
    }
    public List<ProductSizeOptionDTO> getProductSizeOptions() {
        return productSizeOptions;
    }
    public List<ProductOptionDTO> getProductOptions() {
        return productOptions;
    }
    public List<ProductColorOptionDTO> getProductColorOptions() {
        return productColorOptions;
    }
}
