package basilium.basiliumserver.controller.payment;

import basilium.basiliumserver.domain.product.ProductUpdateMessage;
import basilium.basiliumserver.service.purchaseTransaction.PurchaseTransactionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

//결제 시 재고 실시간 관리 카프카 mq + 스케줄링
    /*
    컨트롤러1.
    1-1.처음에 프론트에서 request에 productid 와 count를 주면 총수량을 즉각적으로 수정해서 저장
    1-2.실시간으로 프론트에게 재고 수량을 알려주는 기능 추가


    컨트롤러2.
    2-1.후에 response로 결제 성공 실패 유무를 받아서 성공(true)시에는 수정하지않고
    2-2.false 요청이 들어오면 즉시 구매한 수량만큼 다시 복구
    2-3.또는 요청이 안들어오고 10분이 초과되면 총수량에서 구매한 수량만큼 다시 복구


     */

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final PurchaseTransactionService purchaseTransactionService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    //카프카 mq
    //처음에 프론트에서 request에 productid 와 count를 주면 총수량을 즉각적으로 수정해서 저장
    @PostMapping("/request")
    public String requestPayment(@RequestParam Long productId, @RequestParam Long count) throws Exception {
        ProductUpdateMessage message = new ProductUpdateMessage(productId, count);
        String messageStr = objectMapper.writeValueAsString(message);
        kafkaTemplate.send("product-update-topic", messageStr);
        return "Payment request sent.";
    }

    // 카프카 mq
    //후에 response로 결제 성공 실패 유무를 받아서 성공(true)시에는 수정하지않고
    //false 요청이 들어오면 즉시 구매한 수량만큼 다시 product 수량 복구
    //또는 요청이 안들어오고 10분이 초과되면 총수량에서 구매한 수량만큼 다시 product 수량 복구
    @PostMapping("/response")
    public String paymentResponse(@RequestParam Long productId, @RequestParam Long count, @RequestParam boolean success) {
        purchaseTransactionService.processPaymentResponse(productId, count, success);
        return success ? "Payment successful." : "Payment failed.";
    }
}


