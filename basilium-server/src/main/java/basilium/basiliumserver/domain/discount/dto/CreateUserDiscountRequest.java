package basilium.basiliumserver.domain.discount.dto;

import lombok.*;
import java.time.LocalDateTime;

/** 브랜드가 개인 할인 등록할 때 사용하는 요청 DTO */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateUserDiscountRequest {
    private Long targetUserNumber;    // 할인 받을 NormalUser
    private Long targetProductId;     // 상품 스코프면 세팅
    private Integer extraPercent;     // 0~90
    private LocalDateTime startAt;
    private LocalDateTime endAt;
}