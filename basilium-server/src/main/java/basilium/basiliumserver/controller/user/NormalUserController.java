package basilium.basiliumserver.controller.user;

import basilium.basiliumserver.auth.support.AuthUser;
import basilium.basiliumserver.domain.purchaseTransaction.OrderPaymentRequest;
import basilium.basiliumserver.domain.shoppingCart.ShoppingListDTO;
import basilium.basiliumserver.domain.user.*;
import basilium.basiliumserver.service.Like.LikeService;
import basilium.basiliumserver.service.purchaseTransaction.PurchaseTransactionService;
import basilium.basiliumserver.service.shoppingCart.ShoppingCartService;
import basilium.basiliumserver.service.user.NormalUserService;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/normalUser")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class NormalUserController {
    private final NormalUserService normalUserService;

    private final PurchaseTransactionService purchaseTransactionService;
    private final ShoppingCartService shoppingCartService;
    private final LikeService likeService;


    @PostMapping(value = "/signup")
    public ResponseEntity<String> createNormalUser(@RequestBody NormalUser normalUser) {
        JoinStatus result = normalUserService.join(normalUser);
        return new ResponseEntity<>(result.getMessage(), result.getStatus());
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        String refreshToken = refreshTokenRequest.getRefreshToken();

        if (StringUtils.isBlank(refreshToken)) {
            return ResponseEntity.badRequest().body("리프레시 토큰이 제공되지 않았습니다.");
        }

        if (normalUserService.validateRefreshToken(refreshToken)) {
            String newAccessToken = normalUserService.refreshAccessToken(refreshToken);

            if (newAccessToken != null) {
                return ResponseEntity.ok(new AccessTokenResponse(newAccessToken));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("새로운 액세스 토큰 생성에 실패했습니다.");
            }
        } else {
            return ResponseEntity.badRequest().body("유효하지 않은 리프레시 토큰입니다.");
        }
    }


    @GetMapping("/allNomalUser")
    public List<NormalUser> getAllNomalUsers() {
        return normalUserService.getAllNormalUsers();
    }

    @PatchMapping("/modify")
    public ResponseEntity<String> modifyUser(@AuthUser String userId, @RequestBody UserModifiedInfo info) {
        NormalUser ret = normalUserService.userInfoById(userId);
        ret.setName(info.getName());
        ret.setEmailAddress(info.getEmailAddress());
        ret.setPhoneNumber(info.getPhoneNumber());
        ret.setPassword(info.getPassword());

        System.out.println(info.getName());
        System.out.println(info.getPhoneNumber());
        System.out.println(info.getEmailAddress());
        System.out.println(info.getPassword());
        normalUserService.modify(ret);

        return ResponseEntity.ok("성공적으로 변경되었습니다.");
    }

    @PostMapping("/review")
    public ResponseEntity<String> writeReview(Authentication authentication){
        return ResponseEntity.ok().body(authentication.getName() + "님의 리뷰 등록이 완료되었습니다.");
    }

    @GetMapping("/userInfo")
    public ResponseEntity<NormalUser> userInfo(@AuthUser String userId){
        NormalUser ret = normalUserService.userInfoById(userId);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/user/detail")
    public ResponseEntity<NormalUserInfoDTO> userDetailInfo(@AuthUser String userId){
        NormalUser ret = normalUserService.userInfoById(userId);
        System.out.println(ret.getUserNumber());
        DeliveryInfo info = normalUserService.deliveryInfoByUserNumber(ret.getUserNumber());

        return ResponseEntity.ok(new NormalUserInfoDTO(ret, info));
    }

    @GetMapping("/order/history")
    public ResponseEntity<List<?>> userOrderInfos(@AuthUser String userId){
        NormalUser ret = normalUserService.userInfoById(userId);
        return ResponseEntity.ok(purchaseTransactionService.userOrderHistory(ret.getUserNumber()));
    }

    @GetMapping("/order/payment")
    public ResponseEntity<?> saveUserPayment(@AuthUser String userId){
        NormalUser ret = normalUserService.userInfoById(userId);
        return ResponseEntity.ok(purchaseTransactionService.userOrderHistory(ret.getUserNumber()));
    }

    @GetMapping("/shopping/list")
    public ResponseEntity<List<?>> userShoppingCartList(@AuthUser String userId){
        NormalUser ret = normalUserService.userInfoById(userId);

        return ResponseEntity.ok(shoppingCartService.userShoppingCartHistory(ret.getUserNumber()));
    }

    @GetMapping("/like/list")
    public ResponseEntity<List<?>> userLikeList(@AuthUser String userId, RequestBody Purchase){
        NormalUser ret = normalUserService.userInfoById(userId);

        return ResponseEntity.ok(likeService.userLikeInfo(ret.getUserNumber()));
    }

    @PostMapping("order/payment/{impUid}")
    public ResponseEntity<String> handlePayment(@AuthUser String userId, @PathVariable String impUid, @RequestBody OrderPaymentRequest request) {
        purchaseTransactionService.processPayment(userId, impUid, request);
        return ResponseEntity.ok("Payment processed successfully");
    }

    @DeleteMapping("/shopping/list")
    public ResponseEntity<?> deleteShoppingList(@AuthUser String userId, @RequestParam Long shoppingListId){

        shoppingCartService.deleteSelectedProducts(shoppingListId);
        return ResponseEntity.ok("Selected products deleted successfully");

    }

    /*
    @PostMapping("/login")
    public ResponseEntity<String> loginNormalUser(@RequestBody LoginRequest loginRequest){
        log.info("------------------------------------------------------------");
        log.info("1. normalUser 로그인 시도");
        log.info("ID: " + loginRequest.getUserId() + " ");
        log.info("Password: " + loginRequest.getUserPassword() + " ");
        LoginStatus loginResult = normalUserService.login(loginRequest.getUserId(), loginRequest.getUserPassword());
        if (loginResult != LoginStatus.SUCCESS)return new ResponseEntity<>(loginResult.getMessage(), loginResult.getStatus());
        log.info("------------------------------------------------------------");
        log.info("2. 로그인 성공");
        String token = normalUserService.afterSuccessLogin(loginRequest.getUserId());
        log.info("[normalUser 토큰 정상 발급]");
        log.info(token);
        return ResponseEntity.ok().body(token);
    }




//***************토큰으로 로그아웃 버튼은 1개이니 로그아웃 로직만 유저 전체 합치기*************************
    //예외가 생길수가 없는 로직이니 수정하기
    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        try {
            normalUserService.logout(request);
            return new ResponseEntity<>("로그아웃 성공", HttpStatus.OK);
        } catch (Exception e) {
            //return new ResponseEntity<>("로그아웃 실패: " + e.getMessage(), HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>("로그아웃 실패", HttpStatus.BAD_REQUEST);
        }
    }
//***************토큰으로 로그아웃 로그인? 로직만 유저 전체 합치기*************************
    //회원가입 로직만 별도로 만들기?


 */
}