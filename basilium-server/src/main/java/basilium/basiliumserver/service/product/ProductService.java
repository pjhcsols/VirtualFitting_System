package basilium.basiliumserver.service.product;

import basilium.basiliumserver.controller.product.sse.SseController;
import basilium.basiliumserver.domain.product.Product;
import basilium.basiliumserver.domain.product.kafkaPaymentInventory.ProductInfoDTO;
import basilium.basiliumserver.domain.user.BrandUser;
import basilium.basiliumserver.repository.product.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/*
상품 추가(addProduct)
상품 조회(getProductById, getAllProducts)
상품 업데이트(updateProduct)
상품 삭제(deleteProduct)
전체 상품 수 조회(countProducts)
 */

@Slf4j
@Service
public class ProductService {

    private final ProductRepository productRepository;


    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional
    public Product addProduct(Product product) {
        // 상품 추가 시 필요한 비즈니스 로직 구현
        return productRepository.save(product);
    }

    //@Transactional(readOnly = true)
    public Optional<Product> getProductById(Long productId) {
        return productRepository.findById(productId);
    }

    //@Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return productRepository.getAllProducts();
    }

    @Transactional
    public void updateProduct(Product product) {
        // 상품 업데이트 시 필요한 비즈니스 로직 구현
        productRepository.modify(product);
    }

    @Transactional
    public void deleteProduct(Long productId) {
        // 상품 삭제 시 필요한 비즈니스 로직 구현
        productRepository.deleteById(productId);
    }

    //@Transactional(readOnly = true)
    public long countProducts() {
        return productRepository.count();
    }

    public List<Product> getProductsByName(String name) {
        return productRepository.findByNameContaining(name);
    }


    public Optional<BrandUser> findBrandUserByProductId(Long productId) {
        return productRepository.findBrandUserByProductId(productId);
    }

    public List<Product> findByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    //스케줄러 용
    //@Transactional
    public List<String> getAllProductImageUrls() {
        List<Product> products = productRepository.getAllProducts();
        List<String> allImageUrls = new ArrayList<>();

        for (Product product : products) {
            allImageUrls.addAll(product.getProductPhotoUrl());
            allImageUrls.addAll(product.getProductSubPhotoUrl());
        }

        return allImageUrls;
    }

    //kafka MQ
    @Transactional
    public void updateProductQuantity(Long productId, Long count) {
        log.info("[결제 시도]");
        Product product = productRepository.findById(productId).orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));
        product.setTotalQuantity(product.getTotalQuantity() - count);
        productRepository.save(product);
        log.info("[상품 총량 감소] : Updating product quantity for productId: {} count: - {}", productId, count);
        SseController.updateInventory(productId); //sse를 통한 구독한 재고 변경 실시간 전송
    }

    @Transactional
    public void restoreProductQuantity(Long productId, Long count) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));
        product.setTotalQuantity(product.getTotalQuantity() + count);
        productRepository.save(product);
    }

    //sse
    public Long getProductQuantity(Long productId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));
        return product.getTotalQuantity();
    }
    //sse 재고변경 시 브랜드유저 전송용
    public ProductInfoDTO getProductInfo(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));

        Long brandUserId = product.getBrandUser().getUserNumber(); // Assuming BrandUser is related to Product
        Long totalQuantity = product.getTotalQuantity();

        return new ProductInfoDTO(brandUserId, productId, totalQuantity);
    }

/*
    //rabbit mq
    @Transactional
    public void updateProductQuantity(Long productId, Long count) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));
        product.setTotalQuantity(product.getTotalQuantity() - count);
        productRepository.save(product);
    }

    @Transactional
    public void restoreProductQuantity(Long productId, Long count) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));
        product.setTotalQuantity(product.getTotalQuantity() + count);
        productRepository.save(product);
    }

 */


}
