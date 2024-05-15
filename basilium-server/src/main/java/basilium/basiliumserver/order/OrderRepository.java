package basilium.basiliumserver.order;

import basilium.basiliumserver.domain.user.NormalUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // 특정 유저의 주문 목록 조회
    List<Order> findByNormalUser(NormalUser normalUser);
}

/*
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("select o from Order o" +
            //" left join fetch o.payment p" +
            " left join fetch o.normalUser n" +
            " where o.orderUid = :orderUid")
    Optional<Order> findOrderAndPaymentAndMember(String orderUid);

    @Query("select o from Order o" +
            " left join fetch o.payment p" +
            " where o.orderUid = :orderUid")
    Optional<Order> findOrderAndPayment(String orderUid);


}
 */

