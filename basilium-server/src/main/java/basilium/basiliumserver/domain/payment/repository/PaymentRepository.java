// src/main/java/basilium/basiliumserver/domain/payment/repository/PaymentRepository.java
package basilium.basiliumserver.domain.payment.repository;

import basilium.basiliumserver.domain.payment.entity.Payment;
import basilium.basiliumserver.domain.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByOrderId(String orderId);

    @Modifying
    @Query("""
        UPDATE Payment p
           SET p.status = :toStatus
         WHERE p.orderId = :orderId
           AND p.status = :fromStatus
    """)
    int updateStatusIfMatch(@Param("orderId") String orderId,
                            @Param("fromStatus") PaymentStatus from,
                            @Param("toStatus") PaymentStatus to);

    /** 자정 배치: intent_expires_at 기준 + 상태 필터로 purge 대상 조회 */
    @Query("""
        SELECT p.id FROM Payment p
         WHERE p.intentExpiresAt IS NOT NULL
           AND p.intentExpiresAt <= :threshold
           AND p.status IN :st
    """)
    List<Long> findIdsForPurge(@Param("threshold") LocalDateTime threshold,
                               @Param("st") Collection<PaymentStatus> statuses);

    @Modifying
    @Query("DELETE FROM Payment p WHERE p.id IN :ids")
    int deleteByIds(@Param("ids") Collection<Long> ids);


    /* 조회 */

    // 정렬 포함(최신순) - 일반 유저 본인 결제 내역
    org.springframework.data.domain.Page<basilium.basiliumserver.domain.payment.entity.Payment>
    findByNormalUser_UserNumberOrderByCreatedAtDesc(Long userNumber,
                                                    org.springframework.data.domain.Pageable pageable);

    // 상태 필터(어드민용)
    org.springframework.data.domain.Page<basilium.basiliumserver.domain.payment.entity.Payment>
    findByStatusOrderByCreatedAtDesc(basilium.basiliumserver.domain.payment.entity.PaymentStatus status,
                                     org.springframework.data.domain.Pageable pageable);

    @org.springframework.data.jpa.repository.Query("""
        select distinct p
          from Payment p
          join PaymentIntentLine l on l.payment = p
          join l.product prod
         where prod.brandUser.userNumber = :brandUserNumber
      order by p.createdAt desc
    """)
    org.springframework.data.domain.Page<basilium.basiliumserver.domain.payment.entity.Payment>
    findPageByBrandUserNumber(@org.springframework.data.repository.query.Param("brandUserNumber") Long brandUserNumber,
                              org.springframework.data.domain.Pageable pageable);

}
