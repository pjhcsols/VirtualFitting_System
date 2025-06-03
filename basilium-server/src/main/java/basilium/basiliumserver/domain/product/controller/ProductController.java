package basilium.basiliumserver.domain.product.controller;

import basilium.basiliumserver.domain.product.controller.apiDocs.ProductApiDocs;
import basilium.basiliumserver.domain.product.dto.*;
import basilium.basiliumserver.domain.product.entity.Color;
import basilium.basiliumserver.domain.product.entity.Product;
import basilium.basiliumserver.domain.product.entity.ProductStatus;
import basilium.basiliumserver.domain.user.entity.BrandUser;
import basilium.basiliumserver.domain.product.service.ProductService;
import basilium.basiliumserver.global.auth.support.AuthUser;
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
    public ResponseEntity<String> createProduct(@RequestBody Product product) {
        productService.addProduct(product);
        return ResponseEntity.ok("상품 정보 등록 성공");
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

    // 상품 단건 조회 (GET /api/products/{productId})
    @GetMapping("/{productId}")
    public ResponseEntity<ProductDetailDTO> getProductDetails(@PathVariable Long productId,
                                                              @RequestParam Color color) {
        ProductDetailDTO detailDTO = productService.getProductDetailsByColor(productId, color);
        return ResponseEntity.ok(detailDTO);
    }

    //superUser
    // 전체 상품 조회 (GET /api/products?...)
    @GetMapping
    public ResponseEntity<List<ProductAllRetrieveDTO>> getAllProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(pageable).getContent());
    }

    // 전체 상품 수 조회 (GET /api/products/count)
    @GetMapping("/count")
    public ResponseEntity<Long> countProducts() {
        return ResponseEntity.ok(productService.countProducts());
    }

    // 상품 검색 (GET /api/products/search?productName=xxx)
    @GetMapping("/search")
    public ResponseEntity<List<ProductAllRetrieveDTO>> searchProductsByName(@RequestParam String productName) {
        List<ProductAllRetrieveDTO> searchProduct = productService.searchProductsByName(productName);
        return ResponseEntity.ok(searchProduct);
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

    // 상품의 색상 조회 (GET /api/products/{productId}/colors)
    @GetMapping("/{productId}/colors")
    public ResponseEntity<List<String>> getProductColors(@PathVariable Long productId) {
        List<String> productColors = productService.getProductColors(productId);
        return ResponseEntity.ok(productColors);
    }

    // ========================
    // 상품 옵션 관련 엔드포인트
    // ========================

    // 상품 옵션 수정 (PATCH /b1/products/{productId}/options)
    @PatchMapping("/{productId}/options")
    public ResponseEntity<String> updateProductOption(@PathVariable Long productId,
                                                      @RequestBody ProductOptionDTO optionUpdateRequest) {
        productService.updateProductOption(productId, optionUpdateRequest);
        return ResponseEntity.ok("상품 옵션 수정 성공");
    }

    // 상품 옵션 추가 (POST /b1/products/{productId}/options)
    // 추가 수정할것 색상에 따른 이미지도 추가 가능 고민
    @PostMapping("/{productId}/options")
    public ResponseEntity<String> addProductOption(@PathVariable Long productId,
                                                   @RequestBody ProductOptionDTO createRequest) {
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

    /**
     * brandUser
     * 1) 브랜드 유저: 브랜드 유저에 해당되는 상품 전체 페이지네이션 조회/전체 수정용 리스트
     * */
    @GetMapping("/brand")
    public ResponseEntity<List<ProductEditSummaryDTO>> getMyProducts(
            @AuthUser String userId,
            Pageable pageable) {
        return ResponseEntity.ok(productService.getBrandProducts(userId, pageable).getContent());
    }

    //fetch multiple bags 문제
    // 브랜드 유저가 수정하기 위해 해당되는 상품에 해당하는 모든 컬럼 상세 검색
    /** 2) 브랜드 유저: 단건 수정용 조회 */
    @GetMapping("/brand/{productId}")
    public ResponseEntity<ProductEditDTO> getMyProductDetail(
            @AuthUser String userId,
            @PathVariable Long productId) {
        return ResponseEntity.ok(productService.getBrandProductDetail(userId, productId));
    }

    //브랜드 유저의 id와 상품id를 받아서 판매중 (On Sale) 전시중지 (Exhibition Stopped) 상태 변경
    /** 3) 브랜드 유저: 상태 변경 */
    @PatchMapping("/brand/{productId}/status")
    public ResponseEntity<Void> changeStatus(
            @AuthUser String userId,
            @PathVariable Long productId,
            @RequestParam ProductStatus status
    ) {
        productService.changeStatus(userId, productId, status);
        return ResponseEntity.ok().build();
    }

    /**
     * normalUser
     * 판매중인 상품만 페이지네이션으로 조회
     * GET /b1/products/on-sale?page=0&size=10&sort=productId,desc
     */
    @GetMapping("/on-sale")
    public ResponseEntity<List<ProductAllRetrieveDTO>> getOnSaleProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getOnSaleProducts(pageable).getContent());
    }

    //test 해야됨
    // super user는 상품 이름 or 상품 id로 검색해서 일치하는 상품의 id, name, 상품에 해당되는 모든 색상정보와 수량 리스트를 받음
    /** 3) 슈퍼유저: ?productId= 또는 ?productName= */
    /*
    @GetMapping("/admin")
    public ResponseEntity<?> adminSearchOrDetail(
            @RequestParam(required = false) Long   productId,
            @RequestParam(required = false) String productName
    ) {
        return ResponseEntity.ok(productService.getAdminProducts(productId, productName));
    }

     */

}
