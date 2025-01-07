package basilium.basiliumserver.controller.like;

import basilium.basiliumserver.auth.support.AuthUser;
import basilium.basiliumserver.domain.user.NormalUser;
import basilium.basiliumserver.service.like.LikeService;
import basilium.basiliumserver.service.user.NormalUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/likes")
public class LikeController {
    private final NormalUserService normalUserService;
    private final LikeService likeService;

    @GetMapping("/like/list")
    public ResponseEntity<List<?>> userLikeList(@AuthUser String userId){
        System.out.println("LikeList");
        NormalUser ret = normalUserService.userInfoById(userId);

        return ResponseEntity.ok(likeService.userLikeInfo(ret.getUserNumber()));
    }

    @PostMapping("like/{productId}")
    public ResponseEntity<?> likeProduct(@AuthUser String userId, @PathVariable(name = "productId") Long productId){
        NormalUser ret = normalUserService.userInfoById(userId);
        return ResponseEntity.ok(normalUserService.setLike(ret, productId));
    }

    @GetMapping("like/rank")
    public ResponseEntity<?> getTopFiveProduct(){
        return ResponseEntity.ok(likeService.topFive());
    }
}
