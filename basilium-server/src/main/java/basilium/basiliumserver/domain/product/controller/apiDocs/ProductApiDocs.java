package basilium.basiliumserver.domain.product.controller.apiDocs;

import basilium.basiliumserver.domain.product.dto.ProductOptionUpdateRequest;
import basilium.basiliumserver.domain.product.dto.ProductUpdateRequest;
import basilium.basiliumserver.domain.product.entity.Product;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "상품 관리 기능", description = "상품 관리 및 조회와 관련된 API")
public interface ProductApiDocs {

    @Operation(summary = "상품 생성", description = "새로운 상품을 등록합니다.")
    @PostMapping
    ResponseEntity<?> createProduct(@RequestBody Product product);

    @Operation(summary = "상품 단건 조회", description = "상품 ID를 기반으로 단건 조회합니다.")
    @GetMapping("/{productId}")
    ResponseEntity<?> getProductById(@PathVariable Long productId);

    @Operation(summary = "전체 상품 조회", description = "페이징 처리가 적용된 전체 상품 목록을 조회합니다.")
    @GetMapping
    ResponseEntity<?> getAllProducts(Pageable pageable);

    @Operation(summary = "상품 수정", description = "상품 ID와 업데이트 정보를 기반으로 부분 수정합니다.")
    @PatchMapping("/{id}")
    ResponseEntity<?> updateProduct(@PathVariable("id") Long productId, @RequestBody ProductUpdateRequest updateRequest);


    @Operation(summary = "상품 삭제", description = "상품 ID를 기반으로 상품을 삭제합니다.")
    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteProduct(@PathVariable("id") Long productId);

    @Operation(summary = "상품 수 조회", description = "전체 상품의 개수를 조회합니다.")
    @GetMapping("/count")
    ResponseEntity<?> countProducts();

    @Operation(summary = "상품 검색", description = "상품 이름에 특정 문자열이 포함된 상품을 조회합니다.")
    @GetMapping("/search")
    ResponseEntity<?> searchProductsByName(@RequestParam String productName);

    @Operation(summary = "BrandUser 조회", description = "상품 ID를 기반으로 연관된 BrandUser를 조회합니다.")
    @GetMapping("/brandUser")
    ResponseEntity<?> getBrandUserByProductId(@RequestParam Long productId);

    @Operation(summary = "카테고리별 상품 조회", description = "카테고리 ID를 기반으로 상품 목록을 조회합니다.")
    @GetMapping("/category/{categoryId}")
    ResponseEntity<?> getProductsByCategory(@PathVariable Long categoryId);

    @Operation(summary = "상품 옵션 수정", description = "상품 ID와 옵션 업데이트 정보를 기반으로 상품 옵션을 부분 수정합니다.")
    @PatchMapping("/{productId}/options")
    ResponseEntity<?> updateProductOption(@PathVariable Long productId,
                                          @RequestBody ProductOptionUpdateRequest optionUpdateRequest);

    @Operation(summary = "상품 옵션 추가", description = "상품 ID와 새로운 옵션 정보를 기반으로 상품 옵션을 추가합니다.")
    @PostMapping("/{productId}/options")
    ResponseEntity<?> addProductOption(@PathVariable Long productId,
                                       @RequestBody ProductOptionUpdateRequest createRequest);

    @Operation(summary = "상품 옵션 삭제", description = "상품 ID와 옵션 식별 정보를 기반으로 상품 옵션을 삭제합니다. (Query Parameter: productSize, productColor)")
    @DeleteMapping("/{productId}/options")
    ResponseEntity<?> deleteProductOption(@PathVariable Long productId,
                                          @RequestParam String productSize,
                                          @RequestParam String productColor);

    @Operation(summary = "전체 상품 이미지 URL 조회", description = "모든 상품의 대표 이미지 URL 목록을 조회합니다.")
    @GetMapping("/imageUrls")
    ResponseEntity<?> getAllProductImageUrls();
}
