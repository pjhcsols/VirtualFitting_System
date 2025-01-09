package basilium.basiliumserver.domain.shoppingCart.repository;


import basilium.basiliumserver.domain.payment.repository.dao.OrderListDAO;
import basilium.basiliumserver.domain.shoppingCart.entity.ShoppingCart;
import jakarta.persistence.EntityManager;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class JpaShoppingCartRepo {
    private final EntityManager em;

    public List<OrderListDAO> getUserShoppingCartInfo(Long userId){
        return em.createQuery("select P.productId, S.id, cast(null as localdatetime ), P.productPrice as price, S.amount as totalCnt, P.productName, S.size, S.color FROM Product P, ShoppingCart S where S.normalUser.userNumber = :userId and P.productId = S.product.productId", OrderListDAO.class)
                .setParameter("userId", userId).getResultList();
    }

    public String productPhotoUrl(Long productId){
        return em.createQuery("select p.productPhotoUrl from Product p where p.productId = :productId", String.class)
                .setParameter("productId", productId).getResultList().get(0);
    }

    public void deleteById(Long shoppingListId){
        try{
            ShoppingCart shoppingCart = em.find(ShoppingCart.class, shoppingListId);
            em.remove(shoppingCart);
        }catch (Exception e){
        }
    }

    public void save(ShoppingCart shoppingCart){
        em.persist(shoppingCart);
    }
}
