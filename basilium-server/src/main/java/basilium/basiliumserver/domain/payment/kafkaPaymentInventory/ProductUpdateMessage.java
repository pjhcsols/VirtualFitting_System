package basilium.basiliumserver.domain.payment.kafkaPaymentInventory;

import basilium.basiliumserver.domain.product.entity.Color;
import basilium.basiliumserver.domain.product.entity.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

// Kafka MQ
//Kafka 메시지 큐를 통해 전달되는 상품 업데이트 메시지의 데이터 모델을 정의합니다.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductUpdateMessage {
    private String userId;  // 추가: 결제 요청한 유저 ID
    private Long productId;
    private Long count;
    private UUID taskId; // UUID 필드 추가
    private Size productSize;
    private Color productColor;
}
