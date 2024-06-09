package basilium.basiliumserver.domain.purchaseTransaction;


import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class OrderListDAO {

    Long productId;
    Long shoppingCartId;
    LocalDateTime creationTime;

    Long price;

    Long totalCnt;

    String productName;

    String size;
    String color;



}
