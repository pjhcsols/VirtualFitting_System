// src/main/java/basilium/basiliumserver/domain/cart/repository/CartItemRepository.java
package basilium.basiliumserver.domain.cart.repository;

import basilium.basiliumserver.domain.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}
