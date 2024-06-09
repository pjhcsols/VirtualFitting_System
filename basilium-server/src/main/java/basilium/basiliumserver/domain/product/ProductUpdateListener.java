package basilium.basiliumserver.domain.product;

import basilium.basiliumserver.configuration.kafkaMQ.KafkaConfig;
import basilium.basiliumserver.service.product.ProductService;
import basilium.basiliumserver.service.purchaseTransaction.PurchaseTransactionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

//Kafka MQ Listener
@Component
@RequiredArgsConstructor
public class ProductUpdateListener {

    private final ProductService productService;
    private final PurchaseTransactionService purchaseTransactionService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = KafkaConfig.PRODUCT_UPDATE_TOPIC, groupId = "product-group")
    public void handleProductUpdate(ConsumerRecord<String, String> record) throws Exception {
        ProductUpdateMessage message = objectMapper.readValue(record.value(), ProductUpdateMessage.class);
        Long productId = message.getProductId();
        Long count = message.getCount();

        productService.updateProductQuantity(productId, count);
        purchaseTransactionService.scheduleRestoration(productId, count);
    }
}






/*
// rabbit mq 용
import basilium.basiliumserver.rabbitMQ.RabbitMQConfig;
import basilium.basiliumserver.service.product.ProductService;
import basilium.basiliumserver.service.purchaseTransaction.PurchaseTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductUpdateListener {

    private final ProductService productService;
    private final PurchaseTransactionService purchaseTransactionService;

    @RabbitListener(queues = RabbitMQConfig.PRODUCT_UPDATE_QUEUE)
    public void handleProductUpdate(ProductUpdateMessage message) {
        Long productId = message.getProductId();
        Long count = message.getCount();

        productService.updateProductQuantity(productId, count);
        purchaseTransactionService.scheduleRestoration(productId, count);
    }
}


 */