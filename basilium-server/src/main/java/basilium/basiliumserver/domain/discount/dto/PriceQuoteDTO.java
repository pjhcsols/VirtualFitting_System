package basilium.basiliumserver.domain.discount.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PriceQuoteDTO {
    private Long productId;
    private String brandName;

    private long baseUnitPrice;

    // 상품할인(ProductDiscount)
    private int productDiscountPercent;
    private long productDiscountAmount;
    private long productDiscountedUnitPrice;

    // 개인추가(UserDiscount)
    private Integer userExtraPercent;       // null or 0
    private Long userExtraDiscountAmount;   // null or 0
    private Long finalUnitPrice;            // = productDiscountedUnitPrice - userExtraDiscountAmount
}
