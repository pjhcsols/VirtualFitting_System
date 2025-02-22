package basilium.basiliumserver.domain.payment.controller;

import basilium.basiliumserver.domain.payment.kafkaPaymentInventory.RequestTaskInfo;
import basilium.basiliumserver.domain.product.entity.Color;
import basilium.basiliumserver.domain.product.entity.Size;
import basilium.basiliumserver.global.auth.support.AuthUser;
import basilium.basiliumserver.domain.payment.dto.OrderPaymentRequest;
import basilium.basiliumserver.domain.payment.kafkaPaymentInventory.PaymentInventoryResponse;
import basilium.basiliumserver.domain.payment.kafkaPaymentInventory.ProductUpdateMessage;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import basilium.basiliumserver.domain.payment.service.PaymentService;
import basilium.basiliumserver.domain.user.service.NormalUserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


// 결제 시 재고 실시간 관리 카프카 mq + 스케줄링
@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor //오토와이어 제거한 버전
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;
    private final NormalUserService normalUserService;


    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();
    //private static final ConcurrentHashMap<UUID, String> requestTaskMaps = new ConcurrentHashMap<>();


    @PostMapping("/request")
    public ResponseEntity<PaymentInventoryResponse> requestPayment(
            @AuthUser String userId,
            @RequestParam Long productId,
            @RequestParam Long count,
            @RequestParam Size productSize,
            @RequestParam Color productColor) throws Exception {

        UUID taskId = UUID.randomUUID();

        // Kafka 메시지 전송
        ProductUpdateMessage message = new ProductUpdateMessage(userId, productId, count, taskId, productSize, productColor);
        String messageStr = objectMapper.writeValueAsString(message);
        kafkaTemplate.send("product-update-topic", messageStr);

        log.info("************************************************");
        log.info("taskId {}: userId={}, productId={}, count={}, productSize={}, productColor={}",
                taskId, userId, productId, count, productSize, productColor);

        // 요청 정보를 PaymentService에 저장
        RequestTaskInfo info = new RequestTaskInfo(userId, productId, count, productSize, productColor);
        paymentService.addRequestTask(taskId, info);

        // 예약 복구 작업 등록 및 PaymentInventoryResponse 반환
        PaymentInventoryResponse response = paymentService.scheduleRestoration(userId, productId, count, taskId, productSize, productColor);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/response")
    public ResponseEntity<String> paymentResponse(@RequestParam UUID taskId, @RequestParam boolean success) {
        paymentService.processPaymentResponse(taskId, success);
        return ResponseEntity.ok(success ? "결제 성공" : "결제 실패");
    }
/*
    public static void removeControllerMap(UUID taskId) {
        log.info("[컨트롤러-request]:requestTaskMaps 메모리 해제 전: Getting request task maps - size: {}", requestTaskMaps.size());
        requestTaskMaps.remove(taskId);
        log.info("[컨트롤러-request]:requestTaskMaps 메모리 해제 후: Getting request task maps - size: {}", requestTaskMaps.size());
    }

 */

    @GetMapping("/order/history")
    public ResponseEntity<List<?>> userOrderInfos(@AuthUser String userId){
        NormalUser ret = normalUserService.userInfoById(userId);
        return ResponseEntity.ok(paymentService.userOrderHistory(ret.getUserNumber()));
    }

    @GetMapping("/order/payment")
    public ResponseEntity<?> saveUserPayment(@AuthUser String userId){
        NormalUser ret = normalUserService.userInfoById(userId);
        return ResponseEntity.ok(paymentService.userOrderHistory(ret.getUserNumber()));
    }

    @PostMapping("order/payment/{impUid}")
    public ResponseEntity<String> handlePayment(@AuthUser String userId, @PathVariable String impUid, @RequestBody OrderPaymentRequest request) {
        paymentService.processPayment(userId, impUid, request);
        return ResponseEntity.ok("Payment processed successfully");
    }
}

