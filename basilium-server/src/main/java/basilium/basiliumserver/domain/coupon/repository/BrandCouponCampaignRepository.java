// src/main/java/basilium/basiliumserver/domain/coupon/repository/BrandCouponCampaignRepository.java
package basilium.basiliumserver.domain.coupon.repository;

import basilium.basiliumserver.domain.coupon.entity.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

public interface BrandCouponCampaignRepository extends JpaRepository<BrandCouponCampaign, Long> {

    /* 내가 만든 캠페인 목록(브랜드 홈) */
    @Query("""
        SELECT c FROM BrandCouponCampaign c
         WHERE c.brandUserNumber = :brandUserNumber
         ORDER BY c.createdAt DESC
    """)
    Page<BrandCouponCampaign> findAllByBrand(@Param("brandUserNumber") Long brandUserNumber, Pageable pageable);

    /* 상품 상세: 현재 발급/노출 가능(진행중 & 기간 내) 캠페인 — 브랜드/상품 범위 모두 포함 */
    /** 상품 상세 노출용: 진행중 & 기간 내 + 브랜드/상품 범위, product 참조 필요지점만 즉시 로딩 */
    @EntityGraph(attributePaths = {"product"})
    @Query("""
        SELECT c FROM BrandCouponCampaign c
         WHERE c.status = basilium.basiliumserver.domain.coupon.entity.BrandCouponCampaignStatus.ACTIVE
           AND :now BETWEEN c.startAt AND c.endAt
           AND (
                 (c.scope = basilium.basiliumserver.domain.coupon.entity.BrandCouponScope.PRODUCT
                     AND c.product.productId = :productId)
              OR (c.scope = basilium.basiliumserver.domain.coupon.entity.BrandCouponScope.BRAND
                     AND c.brandUserNumber = :brandUserNumber)
           )
    """)
    List<BrandCouponCampaign> findClaimablesForProduct(@Param("productId") Long productId,
                                                       @Param("brandUserNumber") Long brandUserNumber,
                                                       @Param("now") LocalDateTime now);

    /* ===== 배치 전용: 상태 전이 & 정리 ===== */

    /* 시작 도래: SCHEDULED → ACTIVE */
    @Modifying
    @Query("""
        UPDATE BrandCouponCampaign c
           SET c.status = basilium.basiliumserver.domain.coupon.entity.BrandCouponCampaignStatus.ACTIVE
         WHERE c.status = basilium.basiliumserver.domain.coupon.entity.BrandCouponCampaignStatus.SCHEDULED
           AND c.startAt <= :now
           AND c.endAt   >  :now
    """)
    int activateDueCampaigns(@Param("now") LocalDateTime now);

    /* 종료 도래: (SCHEDULED|ACTIVE) → EXPIRED */
    @Modifying
    @Query("""
        UPDATE BrandCouponCampaign c
           SET c.status = basilium.basiliumserver.domain.coupon.entity.BrandCouponCampaignStatus.EXPIRED
         WHERE c.endAt <= :now
           AND c.status <> basilium.basiliumserver.domain.coupon.entity.BrandCouponCampaignStatus.EXPIRED
    """)
    int expireEndedCampaigns(@Param("now") LocalDateTime now);

    /* 현재 시각 기준 EXPIRED 인 캠페인 ID들 */
    @Query("""
        SELECT c.id FROM BrandCouponCampaign c
         WHERE c.status = basilium.basiliumserver.domain.coupon.entity.BrandCouponCampaignStatus.EXPIRED
           AND c.endAt <= :now
    """)
    List<Long> findExpiredCampaignIds(@Param("now") LocalDateTime now);

    /* 만료 후 보관기간 경과분 purge */
    @Modifying
    @Query("""
        DELETE FROM BrandCouponCampaign c
         WHERE c.status = basilium.basiliumserver.domain.coupon.entity.BrandCouponCampaignStatus.EXPIRED
           AND c.endAt <= :threshold
    """)
    int purgeExpiredOlderThan(@Param("threshold") LocalDateTime threshold);

    /* 필요 시 특정 ID들 삭제 */
    @Modifying
    @Query("DELETE FROM BrandCouponCampaign c WHERE c.id IN :ids")
    int deleteByIdsIn(@Param("ids") Collection<Long> ids);
}
