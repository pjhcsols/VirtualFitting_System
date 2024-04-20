package basilium.basiliumserver.service.product;

import basilium.basiliumserver.domain.product.Product;
import basilium.basiliumserver.repository.product.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/*
상품 추가(addProduct)
상품 조회(getProductById, getAllProducts)
상품 업데이트(updateProduct)
상품 삭제(deleteProduct)
전체 상품 수 조회(countProducts)
 */

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


}
