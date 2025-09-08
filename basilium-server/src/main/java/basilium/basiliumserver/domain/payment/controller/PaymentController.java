// src/main/java/basilium/basiliumserver/domain/payment/controller/PaymentController.java
package basilium.basiliumserver.domain.payment.controller;

import basilium.basiliumserver.domain.payment.controller.apiDocs.PaymentApiDocs;
import basilium.basiliumserver.domain.payment.dto.payment.*;
import basilium.basiliumserver.domain.payment.dto.paymentView.PaymentViewDtos;
import basilium.basiliumserver.domain.payment.service.PaymentCommandService;
import basilium.basiliumserver.domain.payment.service.PaymentQueryService;
import basilium.basiliumserver.domain.payment.service.PaymentService;
import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.auth.support.AuthUser;
import basilium.basiliumserver.global.configuration.kafkaMQ.KafkaConfig;
import basilium.basiliumserver.domain.product.entity.Color;
import basilium.basiliumserver.domain.product.entity.Size;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/b1/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController implements PaymentApiDocs {

    private final PaymentCommandService commandService;
    private final PaymentQueryService paymentQueryService;

    private final PaymentService paymentService;
    //kafka producer 사용 안하는 이유
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    /* ---------- 단건 예약 ---------- */
    @PostMapping("/request")
    @PreAuthorize("hasRole('NORMAL') and #userId == authentication.principal")
    public ResponseEntity<ApiResponse<ReserveAckResponse>> requestPayment(
            @AuthUser String userId,
            @RequestParam Long productId,
            @RequestParam Long count,
            @RequestParam Size productSize,
            @RequestParam Color productColor
    ) {
        final String rid = newRid(userId);
        final var info = new RequestTaskInfo(userId, productId, count, productSize, productColor);

        // 선점 (중복이면 기존 RID/ETA 반환, 신규면 내 RID 고정)
        var ack = paymentService.addReservation(rid, info);

        //로깅용
        if (rid.equals(ack.getReserveTaskOrderPayId())) {
            paymentService.bindRidSignature(rid,
                    paymentService.buildSignatureKey(userId, List.of(info)));
        }

        // 신규 RID일 때만 차감 지시
        if (rid.equals(ack.getReserveTaskOrderPayId())) {
            var msg = new ProductUpdateMessage(rid, userId, productId, count, productSize, productColor);
            kafkaTemplate.send(KafkaConfig.PRODUCT_UPDATE_TOPIC, writeJson(msg));
        }
        return ResponseEntity.ok(ApiResponse.success(ack));
    }

    /* ---------- 배치 예약 (요청 멀티셋 “완전 동일”만 스킵) ---------- */
    @PostMapping("/request-batch")
    @PreAuthorize("hasRole('NORMAL') and #userId == authentication.principal")
    public ResponseEntity<ApiResponse<ReserveAckResponse>> requestPaymentBatch(
            @AuthUser String userId,
            @RequestBody BatchReservationRequest req
    ) {
        final var want = toInfos(userId, req.getItems());

        // 0) 기존 “완전 동일 멀티셋” 선점 여부 (O(1))
        var existingRid = paymentService.existingRidForAny(userId, want);
        if (existingRid.isPresent()) {
            var eta = paymentService.getExpiresAt(existingRid.get())
                    .orElseGet(paymentService::defaultExpiresAtNow);
            return ResponseEntity.ok(ApiResponse.success(
                    ReserveAckResponse.batch(existingRid.get(), eta, toAckItems(req.getItems()))
            ));
        }

        // 1) 신규 RID로 시그니처 선점 (경쟁 시 기존 RID 응답)
        final String rid = newRid(userId);
        var sigKey = paymentService.buildSignatureKey(userId, want);
        var raced = paymentService.registerSignatureIfAbsent(sigKey, rid);
        if (raced.isPresent()) {
            var eta = paymentService.getExpiresAt(raced.get())
                    .orElseGet(paymentService::defaultExpiresAtNow);
            return ResponseEntity.ok(ApiResponse.success(
                    ReserveAckResponse.batch(raced.get(), eta, toAckItems(req.getItems()))
            ));
        }

        // 2) 옵션 기준으로 집계(merge) → 선점(addReservation) + 카프카 배치 차감
        var merged = mergeByOption(want); // (productId,size,color)별 count 합산
        merged.forEach(it -> paymentService.addReservation(rid, it));

        // 3) 선점 번들 생성이 끝난 뒤 바인딩 (중요: 누수/정리 보장)
        paymentService.bindRidSignature(rid, sigKey);

        // 4) Kafka 배치 차감
        var kafkaItems = merged.stream()
                .map(it -> new ProductUpdateBatchMessage.Item(it.getProductId(), it.getCount(), it.getProductSize(), it.getProductColor()))
                .toList();
        kafkaTemplate.send(KafkaConfig.PRODUCT_UPDATE_BATCH_TOPIC,
                writeJson(new ProductUpdateBatchMessage(rid, userId, kafkaItems)));

        // 5) ETA
        var eta = paymentService.getExpiresAt(rid).orElseGet(paymentService::defaultExpiresAtNow);
        return ResponseEntity.ok(ApiResponse.success(
                ReserveAckResponse.batch(rid, eta, toAckItems(req.getItems()))
        ));
    }

    /* ---------- 상태 / 확정 ---------- */
    @GetMapping("/reservations/{rid}")
    public ResponseEntity<ApiResponse<ReservationStatusResponse>> reservationStatus(@PathVariable String rid) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getStatus(rid)));
    }

    @PostMapping("/response-by-reserve")
    public ResponseEntity<ApiResponse<Void>> finalizeByReserve(
            @RequestParam String reserveTaskOrderPayId,
            @RequestParam boolean success
    ) {
        paymentService.finalizeByRid(reserveTaskOrderPayId, success);
        return ResponseEntity.ok(ApiResponse.success());
    }

    /* ---------- Helpers (컨트롤러 지역 유틸: 비즈니스 X) ---------- */

    private static String newRid(String userId) {
        String kst = LocalDateTime.now(ZoneId.of("Asia/Seoul"))
                .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return kst + "-" + UUID.randomUUID() + "-" + userId;
    }

    // 요청 → 내부 info 목록
    private static List<RequestTaskInfo> toInfos(String userId, List<BatchRequestItem> items) {
        return items.stream()
                .map(it -> new RequestTaskInfo(userId, it.getProductId(), it.getCount(), it.getProductSize(), it.getProductColor()))
                .toList();
    }

    // 클라 응답용 Ack 아이템
    private static List<ReserveAckResponse.Item> toAckItems(List<BatchRequestItem> items) {
        return items.stream()
                .map(it -> ReserveAckResponse.Item.builder()
                        .productId(it.getProductId())
                        .count(it.getCount())
                        .productSize(it.getProductSize())
                        .productColor(it.getProductColor())
                        .build())
                .toList();
    }

    // 배치 요청 내 동일 옵션 합산 (과차감 방지)
    private static List<RequestTaskInfo> mergeByOption(List<RequestTaskInfo> want) {
        if (want.isEmpty()) return want;
        record Key(Long p, Size s, Color c) {}
        Map<Key, Long> acc = new HashMap<>(Math.max(4, want.size() * 2));
        want.forEach(it -> acc.merge(new Key(it.getProductId(), it.getProductSize(), it.getProductColor()), it.getCount(), Long::sum));
        String userId = want.get(0).getUserId();
        return acc.entrySet().stream()
                .map(e -> new RequestTaskInfo(userId, e.getKey().p(), e.getValue(), e.getKey().s(), e.getKey().c()))
                .collect(Collectors.toList());
    }

    private String writeJson(Object o) {
        try { return objectMapper.writeValueAsString(o); }
        catch (Exception e) { throw new RuntimeException(e); }
    }

    /** 결제 의도 생성 */
    @PostMapping("/intents")
    public ResponseEntity<ApiResponse<PaymentCommandService.CreateIntentResponse>> createIntent(
            @AuthUser String authUserId,
            @RequestBody PaymentCommandService.CreateIntentRequest req
    ) {
        var resp = commandService.createIntent(authUserId, req);
        return ResponseEntity.ok(ApiResponse.success(resp));
    }

    /** PG 성공 콜백 */
    @GetMapping("/success")
    public ResponseEntity<ApiResponse<Void>> success(
            @RequestParam String paymentType,
            @RequestParam long amount,
            @RequestParam String orderId,
            @RequestParam String paymentKey
    ) {
        commandService.approve(orderId, paymentKey, paymentType, amount);
        return ResponseEntity.ok(ApiResponse.success());
    }

    /** PG 실패 콜백 */
    @GetMapping("/fail")
    public ResponseEntity<ApiResponse<Void>> fail(
            @RequestParam String code,
            @RequestParam String message,
            @RequestParam String orderId
    ) {
        commandService.fail(orderId, code, message);
        return ResponseEntity.ok(ApiResponse.success());
    }

    /** 내 결제 목록 */
    @PreAuthorize("hasRole('NORMAL') and #authUserId == authentication.principal")
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<PaymentViewDtos.PaymentSummaryDto>>> myPayments(
            @AuthUser String authUserId,
            @org.springdoc.core.annotations.ParameterObject org.springframework.data.domain.Pageable pageable
    ) {
        Long me = Long.valueOf(authUserId);
        var page = paymentQueryService.listForBuyer(me, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    /** 브랜드 내 결제 목록 */
    @PreAuthorize("hasRole('BRAND') and #authUserId == authentication.principal")
    @GetMapping("/brand/my")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<PaymentViewDtos.PaymentSummaryDto>>> brandPayments(
            @AuthUser String authUserId,
            @org.springdoc.core.annotations.ParameterObject org.springframework.data.domain.Pageable pageable
    ) {
        Long brand = Long.valueOf(authUserId);
        var page = paymentQueryService.listForBrand(brand, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    /** 어드민 결제 목록 */
    @PreAuthorize("hasRole('SUPER')")
    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<PaymentViewDtos.PaymentSummaryDto>>> adminPayments(
            @RequestParam(required = false) String orderId,
            @RequestParam(required = false) Long buyerUserNumber,
            @RequestParam(required = false) Long brandUserNumber,
            @RequestParam(required = false) basilium.basiliumserver.domain.payment.entity.PaymentStatus status,
            @org.springdoc.core.annotations.ParameterObject org.springframework.data.domain.Pageable pageable
    ) {
        var page = paymentQueryService.listForAdmin(
                Optional.ofNullable(orderId),
                Optional.ofNullable(buyerUserNumber),
                Optional.ofNullable(brandUserNumber),
                Optional.ofNullable(status),
                pageable
        );
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    /** 결제 상세 */
    @PreAuthorize("hasAnyRole('NORMAL','BRAND','SUPER')")
    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<PaymentViewDtos.PaymentDetailDto>> paymentDetail(
            @AuthUser String authUserId,
            @PathVariable Long paymentId
    ) {
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        boolean isSuper = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPER"));
        boolean isBrand = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_BRAND"));

        var dto = isSuper
                ? paymentQueryService.getDetailForAdmin(paymentId)
                : (isBrand
                ? paymentQueryService.getDetailForBrand(Long.valueOf(authUserId), paymentId)
                : paymentQueryService.getDetailForNormal(Long.valueOf(authUserId), paymentId));

        return ResponseEntity.ok(ApiResponse.success(dto));
    }

}
