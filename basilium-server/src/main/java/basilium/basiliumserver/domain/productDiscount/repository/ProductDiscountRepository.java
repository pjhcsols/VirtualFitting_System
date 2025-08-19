// src/main/java/basilium/basiliumserver/domain/productDiscount/repository/ProductDiscountRepository.java
package basilium.basiliumserver.domain.productDiscount.repository;

/*import basilium.basiliumserver.domain.Discount.entity.ProductDiscount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;*/
/*

public interface ProductDiscountRepository extends JpaRepository<ProductDiscount, Long> {

    */
/** 내(브랜드) 모든 할인 (최근 생성순) *//*

    @Query("""
        select pd
          from ProductDiscount pd
         where pd.brandUserNumber = :brandUserNumber
         order by pd.createdAt desc
    """)
    Page<ProductDiscount> findAllByBrand(@Param("brandUserNumber") Long brandUserNumber, Pageable pageable);

    */
/** 특정 상품의 내(브랜드) 할인 (최근 생성순) *//*

    @Query("""
        select pd
          from ProductDiscount pd
         where pd.brandUserNumber = :brandUserNumber
           and pd.product.productId = :productId
         order by pd.createdAt desc
    """)
    Page<ProductDiscount> findAllByBrandAndProduct(@Param("brandUserNumber") Long brandUserNumber,
                                                   @Param("productId") Long productId,
                                                   Pageable pageable);

    */
/** 현재 유효한 할인 목록 (활성 + 기간 포함) *//*

    @Query("""
        select pd
          from ProductDiscount pd
         where pd.product.productId = :productId
           and pd.active = true
           and :now between pd.startAt and pd.endAt
         order by pd.createdAt desc
    """)
    List<ProductDiscount> findActivesNow(@Param("productId") Long productId, @Param("now") LocalDateTime now);

    */
/** 현재 유효한 퍼센트 중 최댓값 (정책: 중복 존재시 최댓값 적용) *//*

    @Query("""
        select max(pd.percent)
          from ProductDiscount pd
         where pd.product.productId = :productId
           and pd.active = true
           and :now between pd.startAt and pd.endAt
    """)
    Optional<Integer> findActivePercentNow(@Param("productId") Long productId, @Param("now") LocalDateTime now);

    */
/** 배치용: 여러 상품의 현재 유효 최댓값(%) *//*

    @Query("""
        select pd.product.productId as productId, max(pd.percent) as percent
          from ProductDiscount pd
         where pd.active = true
           and pd.product.productId in :productIds
           and :now between pd.startAt and pd.endAt
         group by pd.product.productId
    """)
    List<ActivePercentProjection> findActivePercentsByProductIds(@Param("productIds") List<Long> productIds,
                                                                 @Param("now") LocalDateTime now);

    */
/** 브랜드 소유 상품들의 현재 유효 최댓값(%) *//*

    @Query("""
        select pd.product.productId as productId, max(pd.percent) as percent
          from ProductDiscount pd
         where pd.brandUserNumber = :brandUserNumber
           and pd.active = true
           and :now between pd.startAt and pd.endAt
         group by pd.product.productId
    """)
    List<ActivePercentProjection> findActivePercentsOfBrand(@Param("brandUserNumber") Long brandUserNumber,
                                                            @Param("now") LocalDateTime now);

    interface ActivePercentProjection {
        Long getProductId();
        Integer getPercent();
    }

    */
/**
     * UserDiscount
     * 특정 상품의 “현재 유효한” 할인(여러 개면 퍼센트가 큰 순으로)
     **//*

    @Query("""
        SELECT pd FROM ProductDiscount pd
         WHERE pd.product.productId = :productId
           AND pd.active = true
           AND :now BETWEEN pd.startAt AND pd.endAt
         ORDER BY pd.percent DESC, pd.id DESC
    """)
    List<ProductDiscount> findActiveForProduct(@Param("productId") Long productId,
                                               @Param("now") LocalDateTime now);
}
*/
