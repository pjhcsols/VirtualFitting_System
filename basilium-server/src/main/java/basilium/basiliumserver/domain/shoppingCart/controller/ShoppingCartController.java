package basilium.basiliumserver.domain.shoppingCart.controller;

import basilium.basiliumserver.domain.shoppingCart.service.ShoppingCartService;
import basilium.basiliumserver.global.auth.support.AuthUser;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import basilium.basiliumserver.domain.user.service.NormalUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/shoppingCarts")
public class ShoppingCartController {
    private final ShoppingCartService shoppingCartService;
    private final NormalUserService normalUserService;

    @GetMapping("/shopping/list")
    public ResponseEntity<List<?>> userShoppingCartList(@AuthUser String userId){
        NormalUser ret = normalUserService.userInfoById(userId);

        return ResponseEntity.ok(shoppingCartService.userShoppingCartHistory(ret.getUserNumber()));
    }

    @DeleteMapping("/shopping/list")
    public ResponseEntity<?> deleteShoppingList(@AuthUser String userId, @RequestParam Long shoppingListId){

        shoppingCartService.deleteSelectedProducts(shoppingListId);
        return ResponseEntity.ok("Selected products deleted successfully");

    }

    @PostMapping("shopping/{productId}")
    public ResponseEntity<?> addShoppingCart(@AuthUser String userId, @PathVariable(name = "productId") Long productId, @RequestParam String size, @RequestParam String color, @RequestParam Long amount){
        NormalUser ret = normalUserService.userInfoById(userId);
        shoppingCartService.addShoppingCart(ret, productId, size, color, amount);
        return ResponseEntity.ok("장바구니 등록이 완료되었습니다.");
    }
}
