package basilium.basiliumserver.domain.discount.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

/** 스코프/대상 변경 없이 퍼센트·기간·활성만 수정 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UpdateUserDiscountRequest {
    @Min(0) @Max(90)
    private Integer extraPercent;   // Optional
    private LocalDateTime startAt;  // Optional
    private LocalDateTime endAt;    // Optional
    private Boolean active;         // Optional
}
