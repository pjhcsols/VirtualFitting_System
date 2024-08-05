package basilium.basiliumserver.service.shoppingCart;

import basilium.basiliumserver.domain.payment.OrderListDAO;
import basilium.basiliumserver.domain.payment.OrderListDTO;
import basilium.basiliumserver.domain.shoppingCart.ShoppingCart;
import basilium.basiliumserver.domain.user.NormalUser;
import basilium.basiliumserver.repository.product.JpaProductRepository;
import basilium.basiliumserver.repository.shoppingCart.JpaShoppingCartRepo;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ShoppingCartService {

    private final JpaShoppingCartRepo shoppingCartRepo;
    private final JpaProductRepository productRepository;

    public List<OrderListDTO> userShoppingCartHistory(Long userId){
        List<OrderListDAO> list = shoppingCartRepo.getUserShoppingCartInfo(userId);
        List<OrderListDTO> newList = new ArrayList<>();
        for (OrderListDAO item : list){
            OrderListDTO temp = new OrderListDTO();
            temp.setShoppingCartId(item.getShoppingCartId());
            temp.setSize(item.getSize());
            temp.setColor(item.getColor());
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

    @Transactional
    public void deleteSelectedProducts(Long shoppingListId) {

                shoppingCartRepo.deleteById(shoppingListId);


    }
    @Transactional
    public void addShoppingCart(NormalUser user, Long productId, String size, String color, Long amount){
        ShoppingCart shoppingCart = new ShoppingCart();
        shoppingCart.setNormalUser(user);
        shoppingCart.setProduct(productRepository.findById(productId).get());
        shoppingCart.setSize(size);
        shoppingCart.setColor(color);
        shoppingCart.setAmount(amount);
        shoppingCartRepo.save(shoppingCart);
    }
}
