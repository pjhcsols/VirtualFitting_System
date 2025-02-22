package basilium.basiliumserver.domain.like.controller;

import basilium.basiliumserver.global.auth.support.AuthUser;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import basilium.basiliumserver.domain.like.service.LikeService;
import basilium.basiliumserver.domain.user.service.NormalUserService;
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
