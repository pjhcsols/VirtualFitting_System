package basilium.basiliumserver.service.DTO.payment.kafkaPaymentInventory;

import basilium.basiliumserver.configuration.kafkaMQ.KafkaConfig;
import basilium.basiliumserver.service.product.ProductService;
import basilium.basiliumserver.service.payment.PaymentService;
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
        ProductUpdateMessage message = objectMapper.readValue(record.value(), ProductUpdateMessage.class);
        Long productId = message.getProductId();
        Long count = message.getCount();
        UUID taskId = message.getTaskId();

        // Product quantity update
        productService.updateProductQuantity(productId, count);

        // Schedule restoration with the provided UUID
        paymentService.scheduleRestoration(productId, count, taskId);
    }
}
