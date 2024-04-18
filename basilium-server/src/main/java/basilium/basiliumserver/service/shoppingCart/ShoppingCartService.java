package basilium.basiliumserver.service.shoppingCart;

import basilium.basiliumserver.domain.purchaseTransaction.OrderListDTO;
import basilium.basiliumserver.repository.shoppingCart.JpaShoppingCartRepo;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class ShoppingCartService {

    private final JpaShoppingCartRepo shoppingCartRepo;

    public List<OrderListDTO> userShoppingCartHistory(Long userId){
        return shoppingCartRepo.getUserShoppingCartInfo(userId);
    }
}
