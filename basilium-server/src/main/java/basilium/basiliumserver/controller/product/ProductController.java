package basilium.basiliumserver.controller.product;

import basilium.basiliumserver.domain.product.Product;
import basilium.basiliumserver.domain.user.BrandUser;
import basilium.basiliumserver.service.product.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

//브랜드 유저 id로 자신이 관리할수있는 상품 보기->필터로 brand 권한 확인
@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }
/*
    @PostMapping("/create")
    public Product addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

 */
    @PostMapping("/create")
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        try {
            Product createdProduct = productService.addProduct(product);
            return ResponseEntity.ok(createdProduct);
        } catch (Exception e) {
            // 예외 처리 로직
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add product: " + e.getMessage());
        }
    }


    @GetMapping("/{productId}")
    public ResponseEntity<?> getProductById(@PathVariable Long productId) {
        Optional<Product> productOptional = productService.getProductById(productId);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found with id: " + productId);
        }
    }

    @GetMapping("/getAll")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateProduct(@RequestBody Product product) {
        try {
            productService.updateProduct(product);
            return ResponseEntity.ok("상품 정보 수정 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("상품 정보 수정 실패: " + e.getMessage());
        }
    }


    @DeleteMapping("/deleteProduct")
    public void deleteProduct(@RequestParam Long productId) {
        productService.deleteProduct(productId);
    }

    @GetMapping("/count")
    public long countProducts() {
        return productService.countProducts();
    }

    @GetMapping("/search")
    public ResponseEntity<?> getProductsByName(@RequestParam String productName) {
        List<Product> products = productService.getProductsByName(productName);
        if (!products.isEmpty()) {
            return ResponseEntity.ok(products);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No products found with name: " + productName);
        }
    }

    @GetMapping("/brandUser")
    public ResponseEntity<?> getBrandUserByProductId(@RequestParam Long productId) {
        Optional<BrandUser> brandUserOptional = productService.findBrandUserByProductId(productId);
        if (brandUserOptional.isPresent()) {
            BrandUser brandUser = brandUserOptional.get();
            return ResponseEntity.ok(brandUser);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Brand user not found for product id: " + productId);
        }
    }

    //카테고리id로 검색
    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId) {
        return productService.findByCategoryId(categoryId);
    }

    //스케줄러 확인 용
    @GetMapping("/allImageUrls")
    public ResponseEntity<List<String>> getAllProductImageUrls() {
        List<String> imageUrls = productService.getAllProductImageUrls();
        return ResponseEntity.ok(imageUrls);
    }
}
