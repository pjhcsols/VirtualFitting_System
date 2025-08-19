package basilium.basiliumserver.domain.discount.repository;

import basilium.basiliumserver.domain.discount.entity.UserDiscount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface UserDiscountRepository extends JpaRepository<UserDiscount, Long> {

    /** 유저+상품(우선순위 1) */
    @Query("""
        SELECT ud FROM UserDiscount ud
         WHERE ud.user.userNumber = :userNumber
           AND ud.product.productId = :productId
           AND ud.active = true
           AND :now BETWEEN ud.startAt AND ud.endAt
         ORDER BY ud.extraPercent DESC, ud.id DESC
    """)
    List<UserDiscount> findActiveByUserAndProduct(@Param("userNumber") Long userNumber,
                                                  @Param("productId") Long productId,
                                                  @Param("now") LocalDateTime now);

    /** 유저+브랜드 전상품(우선순위 2) */
    @Query("""
        SELECT ud FROM UserDiscount ud
         WHERE ud.user.userNumber = :userNumber
           AND ud.brandUser.userNumber = :brandUserNumber
           AND ud.product IS NULL
           AND ud.active = true
           AND :now BETWEEN ud.startAt AND ud.endAt
         ORDER BY ud.extraPercent DESC, ud.id DESC
    """)
    List<UserDiscount> findActiveByUserAndBrand(@Param("userNumber") Long userNumber,
                                                @Param("brandUserNumber") Long brandUserNumber,
                                                @Param("now") LocalDateTime now);

    /**
     * 관리용: "내(브랜드)가 소유한" 개인할인 전체 페이징
     * - 브랜드 스코프(ud.brandUser == me) OR 상품 스코프(ud.product.brandUser == me)
     * - targetUserNumber / productId / onlyActiveNow 필터
     */
    @Query("""
        SELECT ud FROM UserDiscount ud
         LEFT JOIN ud.brandUser bub
         LEFT JOIN ud.product p
         LEFT JOIN p.brandUser pub
        WHERE ( (bub.userNumber = :brandUserNumber) OR (pub.userNumber = :brandUserNumber) )
          AND ( :targetUserNumber IS NULL OR ud.user.userNumber = :targetUserNumber )
          AND ( :productId IS NULL OR p.productId = :productId )
          AND ( :onlyActiveNow = false OR (ud.active = true AND :now BETWEEN ud.startAt AND ud.endAt) )
        ORDER BY ud.createdAt DESC, ud.id DESC
    """)
    Page<UserDiscount> findOwnedByBrand(@Param("brandUserNumber") Long brandUserNumber,
                                        @Param("targetUserNumber") Long targetUserNumber,
                                        @Param("productId") Long productId,
                                        @Param("onlyActiveNow") boolean onlyActiveNow,
                                        @Param("now") LocalDateTime now,
                                        Pageable pageable);

    /** 단건 조회(+소유검증용 조인 포함) */
    @Query("""
        SELECT ud FROM UserDiscount ud
         LEFT JOIN FETCH ud.brandUser bub
         LEFT JOIN FETCH ud.product p
         LEFT JOIN FETCH p.brandUser pub
        WHERE ud.id = :id
    """)
    UserDiscount findOneWithJoins(@Param("id") Long id);
}
