package basilium.basiliumserver.repository.payment;

import basilium.basiliumserver.domain.DAO.payment.OrderListDAO;
import basilium.basiliumserver.domain.payment.Payment;
import jakarta.persistence.EntityManager;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class JpaPaymentRepository {
    private final EntityManager em;

    public List<OrderListDAO> userOrderHistory(Long userId){
        return em.createQuery("select P.productId, cast(null as Long), PT.creationTime ,P.productPrice, PT.totalCnt, P.productName, PT.size, PT.color FROM Product P, Payment PT where PT.normalUser.userNumber = :userId and P.productId = PT.product.productId", OrderListDAO.class)
                .setParameter("userId", userId).getResultList();
    }

    public String productPhotoUrl(Long productId){
        return em.createQuery("select p.productPhotoUrl from Product p where p.productId = :productId", String.class)
                .setParameter("productId", productId).getResultList().get(0);
    }

    public void savePurchaseTransaction(Payment transaction){
        em.persist(transaction);
    }
}
