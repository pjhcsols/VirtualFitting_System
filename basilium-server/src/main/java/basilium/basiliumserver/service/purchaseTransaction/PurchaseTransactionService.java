package basilium.basiliumserver.service.purchaseTransaction;

import basilium.basiliumserver.domain.purchaseTransaction.OrderListDTO;
import basilium.basiliumserver.repository.purchaseTransaction.JpaPurchaseTransactionRepo;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class PurchaseTransactionService {

    private final JpaPurchaseTransactionRepo jpaPurchaseTransactionRepo;


    public List<OrderListDTO> userOrderHistory(Long userId){
        return jpaPurchaseTransactionRepo.userOrderHistory(userId);
    }
}
