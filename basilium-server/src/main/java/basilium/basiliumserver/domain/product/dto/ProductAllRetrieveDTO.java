package basilium.basiliumserver.domain.product.dto;

import java.util.List;

public class ProductAllRetrieveDTO {
    private final Long productId;
    private final String productName;
    private final Long productPrice;
    private final Long totalQuantity;
    private final String categoryName;
    private final List<String> productColors;
    private final List<String> productPhotoUrls;

    public ProductAllRetrieveDTO(Long productId, String productName, Long productPrice,
                                 Long totalQuantity, String categoryName,
                                 List<String> productColors, List<String> productPhotoUrls) {
        this.productId = productId;
        this.productName = productName;
        this.productPrice = productPrice;
        this.totalQuantity = totalQuantity;
        this.categoryName = categoryName;
        this.productColors = productColors;
        this.productPhotoUrls = productPhotoUrls;
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
    public Long getTotalQuantity() {
        return totalQuantity;
    }
    public String getCategoryName() {
        return categoryName;
    }
    public List<String> getProductColors() {
        return productColors;
    }
    public List<String> getProductPhotoUrls() {
        return productPhotoUrls;
    }
}
