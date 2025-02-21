package basilium.basiliumserver.domain.product.controller;

import basilium.basiliumserver.domain.product.controller.apiDocs.ProductApiDocs;
import basilium.basiliumserver.domain.product.dto.ProductAllRetrieveDTO;
import basilium.basiliumserver.domain.product.dto.ProductOptionUpdateRequest;
import basilium.basiliumserver.domain.product.dto.ProductUpdateRequest;
import basilium.basiliumserver.domain.product.entity.Color;
import basilium.basiliumserver.domain.product.entity.Product;
import basilium.basiliumserver.domain.user.entity.BrandUser;
import basilium.basiliumserver.domain.product.service.ProductService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/b1/products")
public class ProductController implements ProductApiDocs {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // 상품 생성 (POST /api/products)
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product createdProduct = productService.addProduct(product);
        return ResponseEntity.ok(createdProduct);
    }

    // 상품 단건 조회 (GET /api/products/{productId})
    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProductDetails(@PathVariable Long productId,
                                                     @RequestParam Color color) {
        Product product = productService.getProductDetailsByColor(productId, color)
                .orElseThrow(() -> new IllegalArgumentException("해당 상품을 찾을 수 없습니다. (상품 ID: " + productId + ")"));
        return ResponseEntity.ok(product);
    }

    // 전체 상품 조회 (GET /api/products?...)
    @GetMapping
    public ResponseEntity<List<ProductAllRetrieveDTO>> getAllProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(pageable).getContent());
    }

    // 상품 수정 (PATCH /api/products/{id})
    @PatchMapping("/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable("id") Long productId,
                                                @RequestBody ProductUpdateRequest updateRequest) {
        productService.updateProduct(productId, updateRequest);
        return ResponseEntity.ok("상품 정보 수정 성공");
    }

    // 상품 삭제 (DELETE /api/products/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }

    // 전체 상품 수 조회 (GET /api/products/count)
    @GetMapping("/count")
    public ResponseEntity<Long> countProducts() {
        return ResponseEntity.ok(productService.countProducts());
    }

    // 상품 검색 (GET /api/products/search?productName=xxx)
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProductsByName(@RequestParam String productName) {
        List<Product> products = productService.getProductsByName(productName);
        if (products.isEmpty()) {
            throw new IllegalArgumentException("검색어 '" + productName + "'에 해당하는 상품이 없습니다.");
        }
        return ResponseEntity.ok(products);
    }

    // BrandUser 조회 (GET /api/products/brandUser?productId=xxx)
    @GetMapping("/brandUser")
    public ResponseEntity<BrandUser> getBrandUserByProductId(@RequestParam Long productId) {
        BrandUser brandUser = productService.findBrandUserByProductId(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품 ID (" + productId + ")에 해당하는 브랜드 유저를 찾을 수 없습니다."));
        return ResponseEntity.ok(brandUser);
    }

    // 카테고리별 상품 조회 (GET /api/products/category/{categoryId})
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.findByCategoryId(categoryId));
    }

    // ========================
    // 상품 옵션 관련 엔드포인트
    // ========================

    // 상품 옵션 수정 (PATCH /b1/products/{productId}/options)
    @PatchMapping("/{productId}/options")
    public ResponseEntity<String> updateProductOption(@PathVariable Long productId,
                                                      @RequestBody ProductOptionUpdateRequest optionUpdateRequest) {
        productService.updateProductOption(productId, optionUpdateRequest);
        return ResponseEntity.ok("상품 옵션 수정 성공");
    }

    // 상품 옵션 추가 (POST /b1/products/{productId}/options)
    @PostMapping("/{productId}/options")
    public ResponseEntity<String> addProductOption(@PathVariable Long productId,
                                                   @RequestBody ProductOptionUpdateRequest createRequest) {
        productService.addProductOption(productId, createRequest);
        return ResponseEntity.ok("상품 옵션 추가 성공");
    }

    // 상품 옵션 삭제 (DELETE /b1/products/{productId}/options?productSize=xxx&productColor=xxx)
    @DeleteMapping("/{productId}/options")
    public ResponseEntity<String> deleteProductOption(@PathVariable Long productId,
                                                      @RequestParam String productSize,
                                                      @RequestParam String productColor) {
        productService.deleteProductOption(productId, productSize, productColor);
        return ResponseEntity.ok("상품 옵션 삭제 성공");
    }

    // 스케줄러용: 전체 상품 이미지 URL 조회 (GET /api/products/imageUrls)
    @GetMapping("/imageUrls")
    public ResponseEntity<List<String>> getAllProductImageUrls() {
        return ResponseEntity.ok(productService.getAllProductImageUrls());
    }
}
