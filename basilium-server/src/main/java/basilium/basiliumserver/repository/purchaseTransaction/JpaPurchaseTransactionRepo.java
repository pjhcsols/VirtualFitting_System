package basilium.basiliumserver.repository.purchaseTransaction;

import basilium.basiliumserver.domain.purchaseTransaction.OrderListDAO;
import basilium.basiliumserver.domain.purchaseTransaction.PurchaseTransaction;
import jakarta.persistence.EntityManager;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class JpaPurchaseTransactionRepo {
    private final EntityManager em;

    public List<OrderListDAO> userOrderHistory(Long userId){
        return em.createQuery("select P.productId, cast(null as Long), PT.creationTime ,P.productPrice, PT.totalCnt, P.productName, PT.size, PT.color FROM Product P, PurchaseTransaction PT where PT.normalUser.userNumber = :userId and P.productId = PT.product.productId", OrderListDAO.class)
                .setParameter("userId", userId).getResultList();
    }

    public String productPhotoUrl(Long productId){
        return em.createQuery("select p.productPhotoUrl from Product p where p.productId = :productId", String.class)
                .setParameter("productId", productId).getResultList().get(0);
    }

    public void savePurchaseTransaction(PurchaseTransaction transaction){
        em.persist(transaction);
    }
}
