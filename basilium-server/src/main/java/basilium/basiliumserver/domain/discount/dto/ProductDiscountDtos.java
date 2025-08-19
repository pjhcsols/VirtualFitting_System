package basilium.basiliumserver.domain.discount.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

public final class ProductDiscountDtos {

    /** 생성: percent 또는 amount 중 하나만 지정 (둘 다/둘 다 없음 금지) */
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProductDiscountRequest {
        @NotNull private Long productId;
        @Min(0) @Max(90) private Integer percent;      // Optional
        @PositiveOrZero private Long amount;           // Optional
        @NotNull private LocalDateTime startAt;
        @NotNull private LocalDateTime endAt;
        private Boolean active; // null -> true 로 처리 (서비스에서 Optional.orElseGet)
    }

    /** 부분 수정: percent/amount 중 하나만 */
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProductDiscountUpdateRequest {
        @Min(0) @Max(90) private Integer percent;      // Optional
        @PositiveOrZero private Long amount;           // Optional
        private LocalDateTime startAt;                 // Optional
        private LocalDateTime endAt;                   // Optional
        private Boolean active;                        // Optional
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProductDiscountResponse {
        private Long id;
        private Long productId;
        private Long brandUserNumber;

        private Long baseUnitPrice;
        private Integer percent;
        private Long discountAmount;
        private Long discountedUnitPrice;

        private Boolean active;
        private LocalDateTime startAt;
        private LocalDateTime endAt;
        private LocalDateTime createdAt;
    }

    /** 브랜드 전체조회(현재 유효 요약) */
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ActiveSummaryResponse {
        private Long productId;
        private Long baseUnitPrice;
        private Integer percent;
        private Long discountAmount;
        private Long discountedUnitPrice;
    }

    /** 일반 유저 공개 가격 */
    public record PublicPriceView(
            Long productId,
            long baseUnitPrice,
            int productDiscountPercent,
            long productDiscountAmount,
            long productDiscountedUnitPrice
    ) { }
}
