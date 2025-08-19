package basilium.basiliumserver.domain.discount.dto;

import lombok.*;
import java.time.LocalDateTime;

public final class UserDiscountDtos {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UserDiscountResponse {
        private Long id;
        private Long userNumber;
        private Long brandUserNumber;   // 브랜드 스코프면 존재
        private Long productId;         // 상품 스코프면 존재
        private Integer extraPercent;
        private Boolean active;
        private LocalDateTime startAt;
        private LocalDateTime endAt;
        private LocalDateTime createdAt;
    }

}
