package basilium.basiliumserver.domain.like.repository;

import basilium.basiliumserver.domain.like.entity.Like;
import basilium.basiliumserver.domain.product.entity.Product;
import jakarta.persistence.EntityManager;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

/*
JpaLikeRepo 클래스의 EntityManager.createQuery 메서드에서 반환된 결과가 raw type으로 처리되었을 가능성이 큽니다.
> Task :compileJava
Note: /Users/hansol/Desktop/VirtualFitting_System/basilium-server/src/main/java/basilium/basiliumserver/domain/like/repository/JpaLikeRepo.java uses unchecked or unsafe operations.
Note: Recompile with -Xlint:unchecked for details.
 */
@RequiredArgsConstructor
@Repository
public class JpaLikeRepo {

    private final EntityManager em;

    // 좋아요 등록/취소 메서드
    public String save(Like like) {
        // 반환 타입을 Like.class로 명시합니다.
        List<Like> temp = em.createQuery(
                        "select l from Like l where l.product.productId = :productId and l.normalUser.id = :userId",
                        Like.class)
                .setParameter("productId", like.getProduct().getProductId())
                .setParameter("userId", like.getNormalUser().getId())
                .getResultList();

        if (temp.isEmpty()) {
            em.persist(like);
            System.out.println("좋아요가 등록되었습니다.");
            return "좋아요가 등록되었습니다.";
        } else {
            em.remove(temp.get(0));
            System.out.println("좋아요가 취소되었습니다.");
            return "좋아요가 취소되었습니다.";
        }
    }

    // 사용자의 좋아요 히스토리 조회
    public List<Product> userLikeHistory(Long userId) {
        // 이미 반환 타입(Product.class)이 명시되어 있습니다.
        return em.createQuery(
                        "select P FROM Product P, Like L where L.normalUser.userNumber = :userId and P.productId = L.product.productId",
                        Product.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    // 좋아요가 많은 상위 5개 상품 조회 (필요 시 결과 제한 추가 가능)
    public List<Product> getTopFiveProduct() {
        // 반환 타입을 Product.class로 명시합니다.
        return em.createQuery(
                        "SELECT p FROM Product p LEFT JOIN Like l ON p.productId = l.product.productId GROUP BY p.productId ORDER BY COUNT(l) DESC",
                        Product.class)
                .getResultList();
    }
}

/*
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

    public List<Product> getTopFiveProduct(){
        return em.createQuery("SELECT p FROM Product p LEFT JOIN Like l ON p.productId = l.product.productId GROUP BY p.productId ORDER BY COUNT(l) DESC").getResultList();
    }
}

 */