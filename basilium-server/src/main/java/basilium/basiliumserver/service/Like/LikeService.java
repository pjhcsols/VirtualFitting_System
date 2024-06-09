package basilium.basiliumserver.service.Like;


import basilium.basiliumserver.domain.product.Product;
import basilium.basiliumserver.repository.like.JpaLikeRepo;
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


    public List<Product> topFive(){return likeRepo.getTopFiveProduct();}

}
