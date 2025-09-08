// src/main/java/basilium/basiliumserver/domain/payment/repository/PaymentIntentLineRepository.java
package basilium.basiliumserver.domain.payment.repository;

import basilium.basiliumserver.domain.payment.entity.PaymentIntentLine;
import basilium.basiliumserver.domain.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface PaymentIntentLineRepository extends JpaRepository<PaymentIntentLine, Long> {

    @Query("""
        SELECT l FROM PaymentIntentLine l
         WHERE l.payment.orderId = :orderId
    """)
    List<PaymentIntentLine> findAllByOrderId(@Param("orderId") String orderId);

    @Modifying
    @Query("""
        UPDATE PaymentIntentLine l
           SET l.status = :toStatus
         WHERE l.payment.orderId = :orderId
           AND l.status = :fromStatus
    """)
    int updateStatusByOrderIdIfMatch(@Param("orderId") String orderId,
                                     @Param("fromStatus") PaymentStatus from,
                                     @Param("toStatus") PaymentStatus to);

    @Modifying
    @Query("""
        DELETE FROM PaymentIntentLine l
         WHERE l.payment.id IN :paymentIds
    """)
    int deleteByPaymentIds(@Param("paymentIds") Collection<Long> paymentIds);

    /* 조회 */

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"product"})
    java.util.List<basilium.basiliumserver.domain.payment.entity.PaymentIntentLine>
    findAllByPayment_IdIn(java.util.Collection<Long> paymentIds);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"product"})
    java.util.List<basilium.basiliumserver.domain.payment.entity.PaymentIntentLine>
    findAllByPayment_Id(Long paymentId);

    // 브랜드 소유권 확인용(상세 보기 권한 체크)
    boolean existsByPayment_IdAndProduct_BrandUser_UserNumber(Long paymentId, Long brandUserNumber);
}
