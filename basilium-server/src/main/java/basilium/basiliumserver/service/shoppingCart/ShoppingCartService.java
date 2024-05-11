package basilium.basiliumserver.service.shoppingCart;

import basilium.basiliumserver.domain.purchaseTransaction.OrderListDAO;
import basilium.basiliumserver.domain.purchaseTransaction.OrderListDTO;
import basilium.basiliumserver.repository.shoppingCart.JpaShoppingCartRepo;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class ShoppingCartService {

    private final JpaShoppingCartRepo shoppingCartRepo;

    public List<OrderListDTO> userShoppingCartHistory(Long userId){
        List<OrderListDAO> list = shoppingCartRepo.getUserShoppingCartInfo(userId);
        List<OrderListDTO> newList = new ArrayList<>();
        for (OrderListDAO item : list){
            OrderListDTO temp = new OrderListDTO();
            temp.setPrice(item.getPrice());
            temp.setPhotoUrl(shoppingCartRepo.productPhotoUrl(item.getProductId()));
            temp.setCreationTime(item.getCreationTime());
            temp.setProductName(item.getProductName());
            temp.setPrice(item.getPrice());
            temp.setProductId(item.getProductId());
            temp.setTotalCnt(item.getTotalCnt());
            newList.add(temp);
        }

        return newList;
    }
}
