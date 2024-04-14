package basilium.basiliumserver.service.Like;


import basilium.basiliumserver.domain.product.Product;
import basilium.basiliumserver.domain.purchaseTransaction.OrderListDTO;
import basilium.basiliumserver.repository.like.JpaLikeRepo;
import basilium.basiliumserver.repository.purchaseTransaction.JpaPurchaseTransactionRepo;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final JpaLikeRepo likeRepo;

    public List<Product> userLikeInfo(Long userId){
        return likeRepo.userLikeHistory(userId);
    }

}
