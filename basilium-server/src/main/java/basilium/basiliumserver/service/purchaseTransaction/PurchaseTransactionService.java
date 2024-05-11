package basilium.basiliumserver.service.purchaseTransaction;

import basilium.basiliumserver.domain.purchaseTransaction.OrderListDAO;
import basilium.basiliumserver.domain.purchaseTransaction.OrderListDTO;
import basilium.basiliumserver.repository.product.JpaProductRepository;
import basilium.basiliumserver.repository.purchaseTransaction.JpaPurchaseTransactionRepo;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aspectj.weaver.ast.Or;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class PurchaseTransactionService {

    private final JpaPurchaseTransactionRepo jpaPurchaseTransactionRepo;

    public List<OrderListDTO> userOrderHistory(Long userId){
        List<OrderListDAO> list = jpaPurchaseTransactionRepo.userOrderHistory(userId);
        List<OrderListDTO> newList = new ArrayList<>();
        for (OrderListDAO item : list){
            OrderListDTO temp = new OrderListDTO();
            temp.setPrice(item.getPrice());
            temp.setPhotoUrl(jpaPurchaseTransactionRepo.productPhotoUrl(item.getProductId()));
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
