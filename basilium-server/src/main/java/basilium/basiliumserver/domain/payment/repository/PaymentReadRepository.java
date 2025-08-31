package basilium.basiliumserver.domain.payment.repository;

import basilium.basiliumserver.domain.payment.entity.Payment;
import basilium.basiliumserver.domain.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PaymentReadRepository extends JpaRepository<Payment, Long> {

    // 리뷰 10% 적립시 단일 라인 조회
    Optional<Payment> findByIdAndStatus(Long id, PaymentStatus status);

    // ✅ 주문 소유자(userNumber) 조회: Order 엔티티 의존 제거 → Payment에서 조회
    @Query("""
           select distinct p.normalUser.userNumber
             from Payment p
            where p.orderId = :orderId
           """)
    Optional<Long> findAnyUserNumberByOrderId(@Param("orderId") String orderId);

    // ✅ 주문 순결제 합계(승인합 - 환불누계) — enum은 FQCN으로 고정
    @Query("""
           select coalesce(sum(p.amount),0) - coalesce(sum(p.refundedAmountTotal),0)
             from Payment p
            where p.orderId = :orderId
              and p.status = basilium.basiliumserver.domain.payment.entity.PaymentStatus.APPROVED
           """)
    Long sumNetApprovedAmountByOrderId(@Param("orderId") String orderId);
}
