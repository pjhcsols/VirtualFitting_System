package basilium.basiliumserver.domain.product.dto;

import basilium.basiliumserver.domain.category.Category;
import basilium.basiliumserver.domain.product.entity.Material;
import lombok.Getter;

import java.util.List;
import java.util.Optional;

@Getter
public class ProductUpdateRequest {
    // 기본 필드 업데이트 (Optional 처리)
    private Optional<Category> productCategory = Optional.empty();
    private Optional<String> productName = Optional.empty();
    private Optional<Long> productPrice = Optional.empty();
    private Optional<List<Material>> productMaterial = Optional.empty();
    private Optional<String> productDesc = Optional.empty();
    private Optional<Long> totalQuantity = Optional.empty();

    // 상품 옵션 업데이트 정보
    private Optional<List<ProductOptionDTO>> productOptions = Optional.empty();

    // 상품 사이즈 옵션 업데이트 정보
    private Optional<List<ProductSizeOptionDTO>> productSizeOptions = Optional.empty();

    // 상품 색상 옵션 업데이트 정보
    private Optional<List<ProductColorOptionDTO>> productColorOptions = Optional.empty();

    public Optional<Category> getProductCategory() { return productCategory; }
    public Optional<String> getProductName() { return productName; }
    public Optional<Long> getProductPrice() { return productPrice; }
    public Optional<List<Material>> getProductMaterial() { return productMaterial; }
    public Optional<String> getProductDesc() { return productDesc; }
    public Optional<Long> getTotalQuantity() { return totalQuantity; }
    public Optional<List<ProductOptionDTO>> getProductOptions() { return productOptions; }
    public Optional<List<ProductSizeOptionDTO>> getProductSizeOptions() { return productSizeOptions; }
    public Optional<List<ProductColorOptionDTO>> getProductColorOptions() { return productColorOptions; }
}
