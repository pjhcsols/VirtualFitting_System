// src/main/java/basilium/basiliumserver/domain/payment/repository/PaymentReadRepository.java
package basilium.basiliumserver.domain.payment.repository;

import basilium.basiliumserver.domain.payment.entity.Payment;
import basilium.basiliumserver.domain.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PaymentReadRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByIdAndStatus(Long id, PaymentStatus status);

    @Query("""
           select distinct p.normalUser.userNumber
             from Payment p
            where p.orderId = :orderId
           """)
    Optional<Long> findAnyUserNumberByOrderId(@Param("orderId") String orderId);

    @Query("""
           select coalesce(sum(p.amount),0) - coalesce(sum(p.refundedAmountTotal),0)
             from Payment p
            where p.orderId = :orderId
              and p.status = basilium.basiliumserver.domain.payment.entity.PaymentStatus.APPROVED
           """)
    Long sumNetApprovedAmountByOrderId(@Param("orderId") String orderId);
}
