package basilium.basiliumserver.domain.like.service;


import basilium.basiliumserver.domain.like.repository.JpaLikeRepo;
import basilium.basiliumserver.domain.product.entity.Product;

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
