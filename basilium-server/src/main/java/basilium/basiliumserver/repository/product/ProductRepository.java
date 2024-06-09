package basilium.basiliumserver.repository.product;

import basilium.basiliumserver.domain.product.Product;
import basilium.basiliumserver.domain.user.BrandUser;

import java.util.List;
import java.util.Optional;

public interface ProductRepository {
    long count();
    List<Product> getAllProducts();
    Product save(Product product);
    Optional<Product> findById(Long productId);
    void delete(Product product);
    void deleteById(Long productId);
    void deleteAll();
    void modify(Product product);
    //List<Product> findByName(String name);
    List<Product> findByNameContaining(String name);
    Optional<BrandUser> findBrandUserByProductId(Long productId);
    List<Product> findByCategoryId(Long categoryId);
}
/*
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByProductCategory_CategoryId(Long categoryId);
}
 */