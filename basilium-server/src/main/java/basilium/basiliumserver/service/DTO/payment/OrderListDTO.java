package basilium.basiliumserver.service.DTO.payment;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderListDTO {

    Long productId;
    Long shoppingCartId;
    LocalDateTime creationTime;

    Long price;

    Long totalCnt;

    String productName;

    String photoUrl;

    String size;
    String color;

}
