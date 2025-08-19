package basilium.basiliumserver.domain.discount.repository;

import basilium.basiliumserver.domain.discount.entity.ProductDiscount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ProductDiscountRepository extends JpaRepository<ProductDiscount, Long> {

    @Query("""
        select pd
          from ProductDiscount pd
         where pd.brandUserNumber = :brandUserNumber
         order by pd.createdAt desc
    """)
    Page<ProductDiscount> findAllByBrand(@Param("brandUserNumber") Long brandUserNumber, Pageable pageable);

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

    @Query("""
        select pd
          from ProductDiscount pd
         where pd.product.productId = :productId
           and pd.active = true
           and :now between pd.startAt and pd.endAt
         order by pd.createdAt desc
    """)
    List<ProductDiscount> findActivesNow(@Param("productId") Long productId, @Param("now") LocalDateTime now);

    @Query("""
        select max(pd.percent)
          from ProductDiscount pd
         where pd.product.productId = :productId
           and pd.active = true
           and :now between pd.startAt and pd.endAt
    """)
    Optional<Integer> findActivePercentNow(@Param("productId") Long productId, @Param("now") LocalDateTime now);

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

    /** 가격 견적용(퍼센트 큰 순) */
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
