package basilium.basiliumserver.repository.shoppingCart;


import basilium.basiliumserver.domain.purchaseTransaction.OrderListDTO;
import jakarta.persistence.EntityManager;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class JpaShoppingCartRepo {
    private final EntityManager em;

    public List<OrderListDTO> getUserShoppingCartInfo(Long userId){
        return em.createQuery("select P.productId, P.productPrice, S.amount as totalCnt, P.productPhotoUrl, P.productName FROM Product P, ShoppingCart S where S.normalUser.userNumber = :userId and P.productId = S.product.productId", OrderListDTO.class)
                .setParameter("userId", userId).getResultList();
    }
}
