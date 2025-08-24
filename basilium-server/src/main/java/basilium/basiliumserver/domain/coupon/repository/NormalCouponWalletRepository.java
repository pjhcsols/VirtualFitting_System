// src/main/java/basilium/basiliumserver/domain/coupon/repository/NormalCouponWalletRepository.java
package basilium.basiliumserver.domain.coupon.repository;

import basilium.basiliumserver.domain.coupon.entity.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface NormalCouponWalletRepository extends JpaRepository<NormalCouponWallet, Long> {

    /* 소유 검증용 단건 조회 */
    Optional<NormalCouponWallet> findByIdAndUser_UserNumber(Long id, Long userNumber);

    /** 캠페인별 보유 개수를 한 번에 카운트 (N+1 제거) */
    interface CampaignCount {
        Long getCampaignId();
        Long getCnt();
    }

    /** 상태별(AVAILABLE/USED) 그룹 카운트 프로젝션 */
    interface CampaignStatusCount {
        Long getCampaignId();
        NormalCouponWalletStatus getStatus();
        Long getCnt();
    }

    /** 사용자 + 캠페인 목록 기준 상태별 보유 수량 집계 (1회 쿼리) */
    @Query("""
        SELECT w.campaign.id AS campaignId, w.status AS status, COUNT(w) AS cnt
          FROM NormalCouponWallet w
         WHERE w.user.userNumber = :userNumber
           AND w.campaign.id IN :campaignIds
         GROUP BY w.campaign.id, w.status
    """)
    List<CampaignStatusCount> countByUserAndCampaignInGrouped(@Param("userNumber") Long userNumber,
                                                              @Param("campaignIds") Collection<Long> campaignIds);

    @Query("""
        SELECT w.campaign.id AS campaignId, COUNT(w) AS cnt
          FROM NormalCouponWallet w
         WHERE w.user.userNumber = :userNumber
           AND w.campaign.id IN :campaignIds
         GROUP BY w.campaign.id
    """)
    List<CampaignCount> countByUserAndCampaignIn(@Param("userNumber") Long userNumber,
                                                 @Param("campaignIds") Collection<Long> campaignIds);

    /* 사용자-캠페인 보유 개수 (perUserLimit 체크용) */
    @Query("""
        SELECT COUNT(w) FROM NormalCouponWallet w
         WHERE w.user.userNumber = :userNumber
           AND w.campaign.id = :campaignId
    """)
    long countByUserAndCampaign(@Param("userNumber") Long userNumber, @Param("campaignId") Long campaignId);

    /* 결제 옵션에서 N+1 방지: 캠페인(+상품) 즉시 로딩 */
    @EntityGraph(attributePaths = {"campaign", "campaign.product"})
    @Query("""
        SELECT w FROM NormalCouponWallet w
         WHERE w.user.userNumber = :userNumber
           AND w.status = :status
         ORDER BY w.claimedAt DESC
    """)
    List<NormalCouponWallet> findAllByUserAndStatus(@Param("userNumber") Long userNumber,
                                                    @Param("status") NormalCouponWalletStatus status);

    /* 결제 성공 시 원자 소모(멱등) */
    @Modifying
    @Query("""
        UPDATE NormalCouponWallet w
           SET w.status = basilium.basiliumserver.domain.coupon.entity.NormalCouponWalletStatus.USED,
               w.usedAt = CURRENT_TIMESTAMP,
               w.usedOrderId = :orderId
         WHERE w.id = :walletId
           AND w.status = basilium.basiliumserver.domain.coupon.entity.NormalCouponWalletStatus.AVAILABLE
    """)
    int consumeAvailable(@Param("walletId") Long walletId, @Param("orderId") String orderId);


    /* ===== 결제 ===== */
    /* 주문 취소(전액 환불) 복원용: 해당 주문에서 사용된 지갑을 캠페인(+상품)까지 즉시 로딩 */
    @EntityGraph(attributePaths = {"campaign", "campaign.product"})
    @Query("""
        SELECT w FROM NormalCouponWallet w
         WHERE w.usedOrderId = :orderId
           AND w.status = basilium.basiliumserver.domain.coupon.entity.NormalCouponWalletStatus.USED
    """)
    List<NormalCouponWallet> findUsedByOrderIdWithCampaign(@Param("orderId") String orderId);

    /* USED → AVAILABLE 원자 복원(멱등) — 정확히 1건만 복원하도록 서비스에서 제어 */
    @Modifying
    @Query("""
        UPDATE NormalCouponWallet w
           SET w.status = basilium.basiliumserver.domain.coupon.entity.NormalCouponWalletStatus.AVAILABLE,
               w.usedAt = NULL,
               w.usedOrderId = NULL
         WHERE w.id = :walletId
           AND w.status = basilium.basiliumserver.domain.coupon.entity.NormalCouponWalletStatus.USED
           AND w.usedOrderId = :orderId
    """)
    int restoreUsedOne(@Param("walletId") Long walletId, @Param("orderId") String orderId);

    /* ===== 스케줄러 ===== */
    // 대량 DELETE 후 영속성 컨텍스트가 더티 상태로 남지 않도록
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
    DELETE FROM NormalCouponWallet w
     WHERE w.campaign.id IN (
        SELECT c.id FROM BrandCouponCampaign c
         WHERE c.status = basilium.basiliumserver.domain.coupon.entity.BrandCouponCampaignStatus.EXPIRED
           AND c.endAt <= :now
        )
    """)
    int deleteWalletsByExpiredAsOf(@Param("now") LocalDateTime now);

    /* 만료 캠페인 연쇄 정리: 해당 캠페인의 지갑 일괄 삭제 */
    @Modifying
    @Query("DELETE FROM NormalCouponWallet w WHERE w.campaign.id IN :campaignIds")
    int deleteWalletsByCampaignIds(@Param("campaignIds") Collection<Long> campaignIds);


    /* ===== 사용 안할 시 제거 여기부터: 종료 캠페인 연쇄 삭제용 ===== */

    /** 주어진 캠페인들에 속한 지갑 전부 삭제 */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM NormalCouponWallet w WHERE w.campaign.id IN :campaignIds")
    int deleteByCampaignIds(@Param("campaignIds") List<Long> campaignIds);

    /** 사용/만료된 지갑 물리 삭제(보관 기간 경과) */
    @Modifying
    @Query("""
        DELETE FROM NormalCouponWallet w
         WHERE w.status <> basilium.basiliumserver.domain.coupon.entity.NormalCouponWalletStatus.AVAILABLE
           AND ((w.usedAt IS NOT NULL AND w.usedAt < :threshold)
             OR (w.claimedAt < :threshold))
    """)
    int purgeOld(@Param("threshold") LocalDateTime threshold);
}