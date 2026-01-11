// src/main/java/basilium/basiliumserver/domain/cart/dto/CartDtos.java
package basilium.basiliumserver.domain.cart.dto;

import java.util.List;

public class CartDtos {

    /* ===== 요청 ===== */

    public record AddItemReq(
            Long productId,
            String size,
            String color,
            Long quantity
    ) {}

    public record AddItemsReq(List<AddItemReq> items) {}

    public record UpdateItemReq(String size, String color, Long quantity) {}

    /* 결제 성공 후 카트 정리용 (옵션만 비교) */
    public record PurchasedOptionSimple(Long productId, String size, String color) {}

    /* (선택) 옵션+수량 완전 일치 제거용 */
    public record PurchasedOption(Long productId, String size, String color, Long quantity) {}

    /* ===== 응답 ===== */

    public record CartItemView(
            Long itemId,
            Long productId,
            String size,
            String color,
            Long quantity,

            // 상품/옵션 & 이미지
            String productName,
            Long productPrice,
            Long productTotalQuantity,      // 상품 총 재고(옵션 합)
            Long optionQuantity,            // 해당 옵션 남은 재고
            List<String> productPhotoUrls,  // 대표 이미지(색상별)

            // 가격(브랜드할인/쿠폰 배분/최종)
            Integer discountPercent,        // 브랜드 할인 %
            Long discountedPrice,           // 브랜드할인 적용 단가
            Long discountedTotal,           // = discountedPrice * quantity
            Integer couponPercent,          // 선택된 최적 쿠폰 %, 적용되는 라인만 값
            Long couponDiscountPrice,       // 이 라인에 배정된 쿠폰 할인액
            Long finalLinePayable,          // = discountedTotal - couponDiscountPrice

            // 🔁 추가: 브랜드 유저 정보(조회 포함)
            Long brandUserNumber,
            String brandFirmName
    ) {}

    public record TotalsView(
            Long originalAmount,
            Long brandDiscountAmount,
            Long bestCouponDiscountAmount,
            Long finalPayableAmount
    ) {
        public static TotalsView zero() { return new TotalsView(0L, 0L, 0L, 0L); }
    }

    public record CartView(
            Long cartId,
            String normalUserId,
            Long totalLines,
            List<CartItemView> items,
            TotalsView totals,
            boolean created
    ) {}
}
