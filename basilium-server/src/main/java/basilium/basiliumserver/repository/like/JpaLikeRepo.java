package basilium.basiliumserver.repository.like;


import basilium.basiliumserver.domain.product.Product;
import basilium.basiliumserver.domain.purchaseTransaction.OrderListDTO;
import jakarta.persistence.EntityManager;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class JpaLikeRepo {

    private final EntityManager em;
    public List<Product> userLikeHistory(Long userId){
        return em.createQuery("select P FROM Product P, Like L where L.normalUser.userNumber = :userId and P.productId = L.product.productId", Product.class)
                .setParameter("userId", userId).getResultList();
    }
}
