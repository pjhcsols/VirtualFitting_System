// src/main/java/basilium/basiliumserver/domain/payment/kafkaPaymentInventory/KafkaProductUpdateListener.java
package basilium.basiliumserver.domain.payment.kafkaPaymentInventory;

import basilium.basiliumserver.domain.payment.dto.payment.ProductUpdateBatchMessage;
import basilium.basiliumserver.domain.payment.dto.payment.ProductUpdateMessage;
import basilium.basiliumserver.domain.payment.dto.payment.RequestTaskInfo;
import basilium.basiliumserver.domain.payment.service.PaymentService;
import basilium.basiliumserver.domain.product.service.ProductService;
import basilium.basiliumserver.global.configuration.kafkaMQ.KafkaConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaProductUpdateListener {

    private final ProductService productService;
    private final PaymentService paymentService;
    private final ObjectMapper objectMapper;

    /** 단건: 차감 트랜잭션 + 롤백 시 예약 제거 */
    @Transactional
    @KafkaListener(topics = KafkaConfig.PRODUCT_UPDATE_TOPIC, groupId = "product-group")
    public void handleSingle(ConsumerRecord<String, String> record) throws Exception {
        var m = objectMapper.readValue(record.value(), ProductUpdateMessage.class);

        // 백업: 트랜잭션 종료 시점에도 한 번 더 안전 정리
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCompletion(int status) {
                if (status == TransactionSynchronization.STATUS_ROLLED_BACK) {
                    paymentService.cancelAllNoRestore(m.getReserveTaskOrderPayId());
                }
            }
        });

        try {
            // 1) 차감 (실패 시 예외 발생)
            productService.processPaymentProductQuantity(
                    m.getProductId(), m.getProductSize(), m.getProductColor(), m.getCount()
            );

            // 2) 커밋 후(성공 케이스) — 컨트롤러가 이미 선점해둔 정상 케이스가 대부분 (중복이면 서비스가 no-op)
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    try {
                        paymentService.addReservation(
                                m.getReserveTaskOrderPayId(),
                                new RequestTaskInfo(m.getUserId(), m.getProductId(), m.getCount(), m.getProductSize(), m.getProductColor())
                        );
                    } catch (Exception ignore) { /* 중복이면 안전히 무시 */ }
                }
            });

        } catch (RuntimeException ex) {
            // 🔴 핵심: 실패를 감지한 "즉시" 예약/인덱스 정리 (레이스 윈도우 최소화)
            try {
                paymentService.cancelAllNoRestore(m.getReserveTaskOrderPayId());
            } catch (Exception cleanupEx) {
                log.warn("cancelAllNoRestore failed on immediate cleanup, rid={}", m.getReserveTaskOrderPayId(), cleanupEx);
            }
            throw ex; // 반드시 재던져서 트랜잭션 롤백 보장
        }
    }


    /** 배치: 전체 차감 트랜잭션 + 롤백 시 예약 전체 제거 */
    @Transactional
    @KafkaListener(topics = KafkaConfig.PRODUCT_UPDATE_BATCH_TOPIC, groupId = "product-group")
    public void handleBatch(ConsumerRecord<String, String> record) throws Exception {
        var batch = objectMapper.readValue(record.value(), ProductUpdateBatchMessage.class);

        // 백업: 트랜잭션 종료 시점에도 한 번 더 안전 정리
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCompletion(int status) {
                if (status == TransactionSynchronization.STATUS_ROLLED_BACK) {
                    paymentService.cancelAllNoRestore(batch.getReserveTaskOrderPayId());
                }
            }
        });

        try {
            // 1) 모든 항목 차감 (하나라도 실패하면 catch로 이동하여 즉시 정리)
            for (var it : batch.getItems()) {
                productService.processPaymentProductQuantity(
                        it.getProductId(), it.getProductSize(), it.getProductColor(), it.getCount()
                );
            }

            // 2) 커밋 후(성공 케이스) — 대부분 중복으로 no-op
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    for (var it : batch.getItems()) {
                        try {
                            paymentService.addReservation(
                                    batch.getReserveTaskOrderPayId(),
                                    new RequestTaskInfo(batch.getUserId(), it.getProductId(), it.getCount(), it.getProductSize(), it.getProductColor())
                            );
                        } catch (Exception ignore) { /* 중복이면 안전히 무시 */ }
                    }
                }
            });

        } catch (RuntimeException ex) {
            // 🔴 핵심: 실패 즉시 정리 (stale 키를 즉시 제거)
            try {
                paymentService.cancelAllNoRestore(batch.getReserveTaskOrderPayId());
            } catch (Exception cleanupEx) {
                log.warn("cancelAllNoRestore failed on immediate cleanup (batch), rid={}", batch.getReserveTaskOrderPayId(), cleanupEx);
            }
            throw ex; // 롤백 보장
        }
    }
}
