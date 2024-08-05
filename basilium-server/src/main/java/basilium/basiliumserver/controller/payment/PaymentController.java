package basilium.basiliumserver.controller.payment;

import basilium.basiliumserver.auth.support.AuthUser;
import basilium.basiliumserver.domain.payment.OrderPaymentRequest;
import basilium.basiliumserver.domain.payment.kafkaPaymentInventory.PaymentInventoryResponse;
import basilium.basiliumserver.domain.payment.kafkaPaymentInventory.ProductUpdateMessage;
import basilium.basiliumserver.domain.user.NormalUser;
import basilium.basiliumserver.service.payment.PaymentService;
import basilium.basiliumserver.service.user.NormalUserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;


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
    private static final ConcurrentHashMap<UUID, String> requestTaskMaps = new ConcurrentHashMap<>();


    @PostMapping("/request")
    public ResponseEntity<PaymentInventoryResponse> requestPayment(@RequestParam Long productId, @RequestParam Long count) throws Exception {
        UUID requestId = UUID.randomUUID();

        // Assuming kafkaTemplate.send() method is called to trigger the payment process
        ProductUpdateMessage message = new ProductUpdateMessage(productId, count, requestId);
        String messageStr = objectMapper.writeValueAsString(message);
        kafkaTemplate.send("product-update-topic", messageStr);

        //hashmap 안쓸거면 리팩토링
        String key = productId + "-" + count; // productId와 count를 조합하여 고유한 키 생성
        requestTaskMaps.put(requestId, key); // (productId+count)key와 requestId를 사용하여 매핑하여 저장
        log.info("************************************************");
        log.info("requestId {} with key {}", requestId, key);

        // Call the service method and capture the PaymentInventoryResponse object
        //서비스 사용안하게 리펙토링하기
        PaymentInventoryResponse response = paymentService.scheduleRestoration(productId, count, requestId);
        return ResponseEntity.ok(response);

        //밑에는 서비스를 사용안해도 되는거 테스트
        /*
        // 지연 시간 계산 (예: 5분 후)
        LocalDateTime delayTime = LocalDateTime.now().plusMinutes(5);
        // PaymentInventoryResponse 객체 생성
        PaymentInventoryResponse response = new PaymentInventoryResponse(requestId, delayTime);
        // ResponseEntity로 반환
        return ResponseEntity.ok(response);

         */
    }



    @PostMapping("/response")
    public String paymentResponse(@RequestParam UUID requestId, @RequestParam boolean success) {
        // requestId로 해당 요청의 key를 가져옴
        String key = requestTaskMaps.get(requestId);

        if (key == null) {
            log.info("No scheduled task found for requestId: {}", requestId);
            return "No scheduled task found for product.";
        }

        // key 파싱하여 productId와 count 추출
        String[] parts = key.split("-");
        Long productId = Long.valueOf(parts[0]);
        Long count = Long.valueOf(parts[1]);

        log.info("[response]: taskId {} with key {}", requestId, key);

        UUID taskId = requestId;
        // requestId를 그대로 taskId로 사용하여 processPaymentResponse 호출
        paymentService.processPaymentResponse(productId, count, success, taskId);

        // 요청이 처리된 후에는 해당 매핑을 제거하여 메모리 누수를 방지합니다.
        log.info("[컨트롤러-response]:requestTaskMaps 메모리 해제 전: Getting request task maps - size: {}", requestTaskMaps.size());
        requestTaskMaps.remove(requestId);
        log.info("[컨트롤러-response]:requestTaskMaps 메모리 해제 후: Getting request task maps - size: {}", requestTaskMaps.size());
        return success ? "Payment successful." : "Payment failed.";
    }

    public static void removeControllerMap(UUID requestId) {
        log.info("[컨트롤러-request]:requestTaskMaps 메모리 해제 전: Getting request task maps - size: {}", requestTaskMaps.size());
        requestTaskMaps.remove(requestId);
        log.info("[컨트롤러-request]:requestTaskMaps 메모리 해제 후: Getting request task maps - size: {}", requestTaskMaps.size());
    }

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

