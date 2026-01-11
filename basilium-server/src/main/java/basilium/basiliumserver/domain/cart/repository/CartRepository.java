// src/main/java/basilium/basiliumserver/domain/cart/repository/CartRepository.java
package basilium.basiliumserver.domain.cart.repository;

import basilium.basiliumserver.domain.cart.entity.Cart;
import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    @Query("""
    SELECT DISTINCT c FROM Cart c
     LEFT JOIN FETCH c.items i
    WHERE c.normalUserId = :userId
    """)
    Optional<Cart> findWithItemsByUserId(@Param("userId") String userId);

    Optional<Cart> findByNormalUserId(String userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints(@QueryHint(name = "jakarta.persistence.lock.timeout", value = "3000"))
    @Query("""
    SELECT DISTINCT c FROM Cart c
     LEFT JOIN FETCH c.items
    WHERE c.normalUserId = :uid
    """)
    Optional<Cart> findWithItemsByUserIdForUpdate(@Param("uid") String uid);
}
