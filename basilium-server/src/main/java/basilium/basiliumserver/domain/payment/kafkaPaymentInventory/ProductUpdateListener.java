package basilium.basiliumserver.domain.payment.kafkaPaymentInventory;

import basilium.basiliumserver.domain.product.entity.Color;
import basilium.basiliumserver.domain.product.entity.Size;
import basilium.basiliumserver.global.configuration.kafkaMQ.KafkaConfig;
import basilium.basiliumserver.domain.product.service.ProductService;
import basilium.basiliumserver.domain.payment.service.PaymentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

// Kafka MQ
//Kafka 메시지 큐에서 상품 업데이트 메시지를 수신하여 상품 수량을 업데이트하고, 주어진 UUID를 사용하여 스케줄링된 작업을 추가합니다.
@Component
@RequiredArgsConstructor
public class ProductUpdateListener {

    private final ProductService productService;
    private final PaymentService paymentService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = KafkaConfig.PRODUCT_UPDATE_TOPIC, groupId = "product-group")
    public void handleProductUpdate(ConsumerRecord<String, String> record) throws Exception {
        // ProductUpdateMessage는 productId, count, taskId, productSize, productColor 필드를 포함한다고 가정합니다.
        ProductUpdateMessage message = objectMapper.readValue(record.value(), ProductUpdateMessage.class);
        String userId = message.getUserId();
        Long productId = message.getProductId();
        Long count = message.getCount();
        UUID taskId = message.getTaskId();
        Size productSize = message.getProductSize();
        Color productColor = message.getProductColor();

        //(작동시간을 컨트롤러에 넘기기)
        //(여기)


        // 결제 처리: 옵션 단위 재고 차감 및 전체 재고 업데이트
        productService.processPaymentProductQuantity(productId, productSize, productColor, count);

        // 예약된 재고 복구 작업 등록
        //paymentService.scheduleRestoration(productId, count, taskId);
        // 예약된 재고 복구 작업 등록 (옵션 정보 포함)
        paymentService.scheduleRestoration(userId, productId, count, taskId, productSize, productColor);
    }
}
