// src/main/java/basilium/basiliumserver/domain/cart/controller/CartController.java
package basilium.basiliumserver.domain.cart.controller;

import basilium.basiliumserver.domain.cart.controller.apiDocs.CartApiDocs;
import basilium.basiliumserver.domain.cart.dto.CartDtos;
import basilium.basiliumserver.domain.cart.service.CartService;
import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.auth.support.AuthUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/b1/carts")
public class CartController implements CartApiDocs {

    private final CartService service;

    // ✅ /me: 바디 없으면 생성+조회, 바디 있으면 추가 후 전체 반환
    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    @PostMapping("/me")
    public ResponseEntity<ApiResponse<CartDtos.CartView>> ensureAndGetOrAdd(
            @AuthUser String authUserId,
            @RequestBody(required = false) CartDtos.AddItemsReq req
    ) {
        return ResponseEntity.ok(ApiResponse.success(service.ensureAndGetOrAdd(authUserId, req)));
    }

    /*
    @Override
    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<CartDtos.CartView>> ensureAndGet(@AuthUser String authUserId) {
        return ResponseEntity.ok(ApiResponse.success(service.ensureAndGet(authUserId)));
    }

     */

    @Override
    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    @GetMapping("/me/peek")
    public ResponseEntity<ApiResponse<CartDtos.CartView>> peek(@AuthUser String authUserId) {
        return ResponseEntity.ok(ApiResponse.success(service.peek(authUserId)));
    }

    @Override
    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    @PostMapping("/me/items")
    public ResponseEntity<ApiResponse<CartDtos.CartView>> addItem(@AuthUser String authUserId,
                                                                  @RequestBody CartDtos.AddItemReq req) {
        return ResponseEntity.ok(ApiResponse.success(service.addItem(authUserId, req)));
    }

    @Override
    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    @PostMapping("/me/items/bulk")
    public ResponseEntity<ApiResponse<CartDtos.CartView>> addItems(@AuthUser String authUserId,
                                                                   @RequestBody CartDtos.AddItemsReq req) {
        return ResponseEntity.ok(ApiResponse.success(service.addItems(authUserId, req)));
    }

    @Override
    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    @PatchMapping("/me/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDtos.CartView>> updateItem(@AuthUser String authUserId,
                                                                     @PathVariable Long itemId,
                                                                     @RequestBody CartDtos.UpdateItemReq req) {
        return ResponseEntity.ok(ApiResponse.success(service.updateItem(authUserId, itemId, req)));
    }

    @Override
    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    @DeleteMapping("/me/items")
    public ResponseEntity<ApiResponse<CartDtos.CartView>> removeItems(@AuthUser String authUserId,
                                                                      @RequestParam List<Long> itemIds) {
        return ResponseEntity.ok(ApiResponse.success(service.removeItems(authUserId, itemIds)));
    }

    @Override
    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    @DeleteMapping("/me/items/by-option")
    public ResponseEntity<ApiResponse<CartDtos.CartView>> removeByOption(@AuthUser String authUserId,
                                                                         @RequestParam Long productId,
                                                                         @RequestParam String size,
                                                                         @RequestParam String color) {
        return ResponseEntity.ok(ApiResponse.success(service.removeByOption(authUserId, productId, size, color)));
    }

    @Override
    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> clearAll(@AuthUser String authUserId) {
        service.clearAll(authUserId);
        return ResponseEntity.ok(ApiResponse.success());
    }
}