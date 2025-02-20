package basilium.basiliumserver.domain.product.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ProductSizeOptionUpdateRequest {
    private String productSize;   // Enum 이름 (예: "M", "L" 등)
    private Long totalLength;     // 총장
    private Long chest;           // 가슴둘레
    private Long shoulder;        // 어깨길이
    private Long arm;             // 팔길이
}
