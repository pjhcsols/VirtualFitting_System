// src/main/java/basilium/basiliumserver/domain/order/repository/OrderRepository.java
package basilium.basiliumserver.domain.order.repository;

import basilium.basiliumserver.domain.order.entity.Order;
import basilium.basiliumserver.domain.order.entity.OrderStatus;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, String> {

    Optional<Order> findByOrderId(String orderId);

    Page<Order> findByUserNumberOrderByCreatedAtDesc(Long userNumber, Pageable pageable);

    @Query("""
        select distinct o
          from Order o
          join Payment p on p.orderId = o.orderId
          join PaymentIntentLine l on l.payment = p
          join l.product prod
         where prod.brandUser.userNumber = :brandUserNumber
      order by o.createdAt desc
    """)
    Page<Order> findPageByBrandUserNumber(@Param("brandUserNumber") Long brandUserNumber, Pageable pageable);

    @Query("""
        select distinct o
          from Order o
          join Payment p on p.orderId = o.orderId
          join PaymentIntentLine l on l.payment = p
          join l.product prod
         where prod.brandUser.userNumber = :brandUserNumber
           and o.status = basilium.basiliumserver.domain.order.entity.OrderStatus.CANCEL_REQUESTED
      order by o.createdAt desc
    """)
    Page<Order> findCancelRequestedByBrand(@Param("brandUserNumber") Long brandUserNumber, Pageable pageable);

    @Query("""
        select o from Order o
         where (:buyer is null or o.userNumber = :buyer)
           and (:st is null or o.status = :st)
      order by o.createdAt desc
    """)
    Page<Order> adminFilter(@Param("buyer") Long buyerUserNumber,
                            @Param("st") OrderStatus status,
                            Pageable pageable);

    @Query("""
        select o from Order o
         where o.status = basilium.basiliumserver.domain.order.entity.OrderStatus.CANCEL_REQUESTED
      order by o.createdAt desc
    """)
    Page<Order> adminCancelRequested(Pageable pageable);
}
