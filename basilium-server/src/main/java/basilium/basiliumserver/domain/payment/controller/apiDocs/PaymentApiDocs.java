// src/main/java/basilium/basiliumserver/domain/payment/controller/apiDocs/PaymentApiDocs.java
package basilium.basiliumserver.domain.payment.controller.apiDocs;

import basilium.basiliumserver.domain.payment.dto.OrderPaymentRequest;
import basilium.basiliumserver.domain.payment.kafkaPaymentInventory.PaymentInventoryResponse;
import basilium.basiliumserver.domain.product.entity.Color;
import basilium.basiliumserver.domain.product.entity.Size;
import basilium.basiliumserver.global.auth.support.AuthUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "결제 관리 기능", description = "결제 관리 및 재고 차감 및 조회와 관련된 API")
@RequestMapping("/b1/payment")
public interface PaymentApiDocs {

    @Operation(summary = "결제 요청", description = "상품 재고 차감 예약을 생성하고, 중복 요청 시 기존 예약 정보를 반환합니다.")
    @PostMapping("/request")
    ResponseEntity<PaymentInventoryResponse> requestPayment(
            @AuthUser String userId,
            @RequestParam Long productId,
            @RequestParam Long count,
            @RequestParam Size productSize,
            @RequestParam Color productColor
    ) throws Exception;

    @Operation(summary = "결제 결과 처리", description = "PG사로부터 받은 결제 성공/실패 결과를 처리합니다.")
    @PostMapping("/response")
    ResponseEntity<String> paymentResponse(
            @RequestParam UUID taskId,
            @RequestParam boolean success
    );

    @Operation(summary = "주문 내역 조회", description = "로그인한 사용자의 주문 이력을 조회합니다.")
    @GetMapping("/order/history")
    ResponseEntity<List<?>> userOrderInfos(
            @AuthUser String userId
    );

    @Operation(summary = "결제 내역 조회", description = "로그인한 사용자의 결제 내역을 조회합니다.")
    @GetMapping("/order/payment")
    ResponseEntity<?> saveUserPayment(
            @AuthUser String userId
    );

    @Operation(summary = "결제 정보 저장", description = "PG 승인 후 결제 정보를 저장합니다.")
    @PostMapping("/order/payment/{impUid}")
    ResponseEntity<String> handlePayment(
            @AuthUser String userId,
            @PathVariable String impUid,
            @RequestBody OrderPaymentRequest request
    );
}
