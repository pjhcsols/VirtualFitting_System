package basilium.basiliumserver.domain.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//Kafka MQ
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductUpdateMessage {
    private Long productId;
    private Long count;
}