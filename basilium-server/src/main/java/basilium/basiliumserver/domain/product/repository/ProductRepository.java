package basilium.basiliumserver.domain.product.repository;

import basilium.basiliumserver.domain.product.dto.ProductAllRetrieveDTO;
import basilium.basiliumserver.domain.product.entity.Color;
import basilium.basiliumserver.domain.product.entity.Product;
import basilium.basiliumserver.domain.user.entity.BrandUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;



/**
 * Spring Data JPA를 활용한 ProductRepository.
 * JpaRepository<Product, Long>를 상속받아 기본 CRUD, 페이징, 정렬 기능을 자동 제공받습니다.
 */
public interface ProductRepository extends JpaRepository<Product, Long> {
/*
    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN FETCH p.productCategory " +
            "LEFT JOIN FETCH p.productOptions " +
            "LEFT JOIN FETCH p.productPhotoUrl")
    List<Product> findAllCategoryOptionsPhotoWithFetchJoin();

 */

    //상세보기
    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN FETCH p.productCategory " +
            "LEFT JOIN FETCH p.brandUser " +
            "LEFT JOIN FETCH p.productOptions " +
            "LEFT JOIN FETCH p.productSizeOptions " +
            "LEFT JOIN FETCH p.productColorOptions pc " +
            "LEFT JOIN FETCH pc.productPhotoUrls " +  // 대표 이미지만 fetch join
            "WHERE p.productId = :productId " +
            "AND pc.id.productColor = :color")
    Optional<Product> findByIdAndColorWithRepresentativeImages(@Param("productId") Long productId,
                                                               @Param("color") Color color);

    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN FETCH p.productCategory " +
            "LEFT JOIN FETCH p.productOptions " +
            "LEFT JOIN FETCH p.productSizeOptions " +
            "LEFT JOIN FETCH p.productColorOptions " +
            "WHERE p.productId = :productId")
    Optional<Product> findByIdWithDetails(@Param("productId") Long productId);

    @Query(value = "SELECT p FROM Product p " +
            "LEFT JOIN FETCH p.productCategory",
            countQuery = "SELECT COUNT(p) FROM Product p")
    Page<Product> findAllWithDetails(Pageable pageable);


    /**
     * 제품 이름에 특정 문자열이 포함된 제품 목록 조회.
     */
    List<Product> findByProductNameContaining(String name);

    /**
     * 제품 아이디를 기반으로 연관된 BrandUser 조회.
     */
    @Query("SELECT p.brandUser FROM Product p WHERE p.productId = :productId")
    Optional<BrandUser> findBrandUserByProductId(@Param("productId") Long productId);

    /**
     * 카테고리 아이디로 제품 목록 조회 (내부 관계 필드 사용).
     */
    List<Product> findByProductCategory_CategoryId(Long categoryId);
}