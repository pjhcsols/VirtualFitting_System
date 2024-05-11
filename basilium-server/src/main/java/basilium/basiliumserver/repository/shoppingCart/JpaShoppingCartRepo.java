package basilium.basiliumserver.repository.shoppingCart;


import basilium.basiliumserver.domain.purchaseTransaction.OrderListDAO;
import jakarta.persistence.EntityManager;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class JpaShoppingCartRepo {
    private final EntityManager em;

    public List<OrderListDAO> getUserShoppingCartInfo(Long userId){
        return em.createQuery("select P.productId, cast(null as localdatetime ), P.productPrice as price, S.amount as totalCnt, P.productName FROM Product P, ShoppingCart S where S.normalUser.userNumber = :userId and P.productId = S.product.productId", OrderListDAO.class)
                .setParameter("userId", userId).getResultList();
    }

    public String productPhotoUrl(Long productId){
        return em.createQuery("select p.productPhotoUrl from Product p where p.productId = :productId", String.class)
                .setParameter("productId", productId).getSingleResult();
    }
}
