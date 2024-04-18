package basilium.basiliumserver.repository.purchaseTransaction;

import basilium.basiliumserver.domain.product.Product;
import basilium.basiliumserver.domain.purchaseTransaction.OrderListDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Tuple;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class JpaPurchaseTransactionRepo {
    private final EntityManager em;

    public List<OrderListDTO> userOrderHistory(Long userId){
        return em.createQuery("select P.productId, PT.creationTime, P.productPrice, PT.totalCnt, P.productPhotoUrl, P.productName FROM Product P, PurchaseTransaction PT where PT.normalUser.userNumber = :userId and P.productId = PT.product.productId", OrderListDTO.class)
                .setParameter("userId", userId).getResultList();
    }
}
