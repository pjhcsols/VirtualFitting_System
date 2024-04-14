package basilium.basiliumserver.service.purchaseTransaction;

import basilium.basiliumserver.domain.product.Product;
import basilium.basiliumserver.domain.purchaseTransaction.OrderListDTO;
import basilium.basiliumserver.repository.purchaseTransaction.JpaPurchaseTransactionRepo;
import jakarta.persistence.Tuple;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class purchaseTransactionService {

    private final JpaPurchaseTransactionRepo jpaPurchaseTransactionRepo;


    public List<OrderListDTO> userOrderHistory(Long userId){
        return jpaPurchaseTransactionRepo.userOrderHistory(userId);
    }
}
