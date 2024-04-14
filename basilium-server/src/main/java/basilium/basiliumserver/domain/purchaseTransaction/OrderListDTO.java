package basilium.basiliumserver.domain.purchaseTransaction;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderListDTO {

    Long productId;
    String creationTime;

    Long price;

    Long totalCnt;

    String photoUrl;

    String productName;

}
