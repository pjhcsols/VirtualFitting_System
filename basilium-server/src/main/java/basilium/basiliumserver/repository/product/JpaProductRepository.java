package basilium.basiliumserver.repository.product;

import basilium.basiliumserver.domain.product.Product;
import basilium.basiliumserver.domain.user.BrandUser;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public class JpaProductRepository implements ProductRepository {

    private final EntityManager em;

    public JpaProductRepository(EntityManager em) {
        this.em = em;
    }

    @Override
    public long count() {
        return em.createQuery("select count(p) from Product p", Long.class).getSingleResult();
    }

    @Override
    public List<Product> getAllProducts() {
        return em.createQuery("SELECT p FROM Product p", Product.class).getResultList();
    }

    @Override
    public Product save(Product product) {
        em.persist(product);
        return product;
    }

    @Override
    public Optional<Product> findById(Long productId) {
        try {
            Product product = em.find(Product.class, productId);
            return Optional.ofNullable(product);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

    @Override
    public void delete(Product product) {
        em.remove(product);
    }

    @Override
    public void deleteById(Long productId) {
        Product product = findById(productId).orElse(null);
        if (product != null) {
            em.remove(product);
        }
    }

    @Override
    public void deleteAll() {
        em.createQuery("delete from Product").executeUpdate();
    }

    @Override
    @Transactional
    public void modify(Product product) {
        Product existingProduct = em.find(Product.class, product.getProductId());
        if (existingProduct != null) {
            existingProduct.setProductCategory(product.getProductCategory());
            existingProduct.setProductName(product.getProductName());
            existingProduct.setProductPrice(product.getProductPrice());
            existingProduct.setProductMaterial(product.getProductMaterial());
            existingProduct.setProductSize(product.getProductSize());
            existingProduct.setProductTotalLength(product.getProductTotalLength());
            existingProduct.setProductChest(product.getProductChest());
            existingProduct.setProductShoulder(product.getProductShoulder());
            existingProduct.setProductArm(product.getProductArm());
            existingProduct.setProductColor(product.getProductColor());
            existingProduct.setProductDesc(product.getProductDesc());

            existingProduct.setProductPhotoUrl(product.getProductPhotoUrl());
            existingProduct.setProductSubPhotoUrl(product.getProductSubPhotoUrl());
            existingProduct.setTotalQuantity(product.getTotalQuantity());
            //existingProduct.setBrandUser(product.getBrandUser());

            em.merge(existingProduct); // 변경 내용 저장
        }
    }

/*
    @Override
    public List<Product> findByName(String name) {
        return em.createQuery("select p from Product p where p.productName = :name", Product.class)
                .setParameter("name", name)
                .getResultList();
    }

 */

    //상품 이름 2글자이상 검색기능
    @Override
    public List<Product> findByNameContaining(String name) {
        return em.createQuery("SELECT p FROM Product p WHERE p.productName LIKE :name", Product.class)
                .setParameter("name", "%" + name + "%")
                .getResultList();
    }


    @Override
    public Optional<BrandUser> findBrandUserByProductId(Long productId) {
        try {
            BrandUser brandUser = em.createQuery("SELECT p.brandUser FROM Product p WHERE p.productId = :productId", BrandUser.class)
                    .setParameter("productId", productId)
                    .getSingleResult();
            return Optional.ofNullable(brandUser);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

    //카테고리id로 검색
    @Override
    public List<Product> findByCategoryId(Long categoryId) {
        return em.createQuery("SELECT p FROM Product p WHERE p.productCategory.categoryId = :categoryId", Product.class)
                .setParameter("categoryId", categoryId)
                .getResultList();
    }

}