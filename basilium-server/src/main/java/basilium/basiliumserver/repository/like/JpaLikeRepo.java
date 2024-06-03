package basilium.basiliumserver.repository.like;


import basilium.basiliumserver.domain.like.Like;
import basilium.basiliumserver.domain.product.Product;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class JpaLikeRepo {

    private final EntityManager em;
    public String save(Like like){
        List<Like> temp = em.createQuery("select l from Like l where l.product.productId = :productId and l.normalUser.id = :userId").setParameter("productId", like.getProduct().getProductId()).setParameter("userId", like.getNormalUser().getId()).getResultList();

        if(temp.size() == 0){
            em.persist(like);
            System.out.println("좋아요가 등록되었습니다.");
            return "좋아요가 등록되었습니다.";
        }
        else{
            em.remove(temp.get(0));
            System.out.println("좋아요가 안등록되었습니다.");
            return "좋아요가 취소되었습니다.";
        }
    }
    public List<Product> userLikeHistory(Long userId){
        return em.createQuery("select P FROM Product P, Like L where L.normalUser.userNumber = :userId and P.productId = L.product.productId", Product.class)
                .setParameter("userId", userId).getResultList();
    }
}
