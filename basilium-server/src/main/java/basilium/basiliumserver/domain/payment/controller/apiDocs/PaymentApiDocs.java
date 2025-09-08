// src/main/java/basilium/basiliumserver/domain/payment/controller/apiDocs/PaymentApiDocs.java
package basilium.basiliumserver.domain.payment.controller.apiDocs;

import basilium.basiliumserver.domain.payment.dto.payment.BatchReservationRequest;
import basilium.basiliumserver.domain.payment.dto.payment.ReserveAckResponse;
import basilium.basiliumserver.domain.payment.dto.payment.ReservationStatusResponse;
import basilium.basiliumserver.domain.payment.dto.paymentView.PaymentViewDtos;
import basilium.basiliumserver.domain.payment.entity.PaymentStatus;
import basilium.basiliumserver.domain.payment.service.PaymentCommandService;
import basilium.basiliumserver.domain.product.entity.Color;
import basilium.basiliumserver.domain.product.entity.Size;
import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.auth.support.AuthUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Tag(name = "결제", description = "재고 예약, 결제 의도 생성/승인/실패 콜백, 배치 예약 및 결제 내역 조회 API")
@RequestMapping(value = "/b1/payment", produces = MediaType.APPLICATION_JSON_VALUE)
public interface PaymentApiDocs {

    /* ======================== 재고 예약/상태 + 결제 의도/응답 ======================== */

    @Operation(
            summary = "결제 요청(단건) — 재고 예약",
            description = """
                    단일 상품 옵션에 대해 재고를 예약하고 예약 식별자(RID)를 발급합니다.
                    - Kafka로 재고 차감 메시지를 발행
                    - 예약 만료 시간(ETA)은 서버 설정(payment.reservation.ttl-minutes) 기준
                    - 중복 요청 시: 동일 사용자/상품/옵션/수량 조합이 이미 예약 중이면 기존 RID/ETA를 그대로 반환
                    권한: ROLE_NORMAL(본인)
                    응답: reserveTaskOrderPayId, expiresAt, items
                    """
    )
    @PostMapping("/request")
    ResponseEntity<ApiResponse<ReserveAckResponse>> requestPayment(
            @Parameter(description = "인증 사용자 ID(일반 유저). SecurityContext에서 주입", required = true, example = "10001")
            @AuthUser String userId,
            @Parameter(description = "상품 ID", required = true, example = "501")
            @RequestParam Long productId,
            @Parameter(description = "수량(>0)", required = true, example = "1")
            @RequestParam Long count,
            @Parameter(description = "옵션: 사이즈", required = true, example = "M")
            @RequestParam Size productSize,
            @Parameter(description = "옵션: 색상", required = true, example = "BLACK")
            @RequestParam Color productColor
    );

    @Operation(
            summary = "결제 요청(배치) — 장바구니 재고 예약",
            description = """
                    여러 상품 옵션을 한 번에 재고 예약합니다.
                    - 사전 중복 스캔: 전달된 모든 아이템의 구성(상품/옵션/수량)이 기존 예약과 완전히 동일하면 기존 RID/ETA를 반환
                    - 신규일 경우 하나의 RID로 일괄 선점 후 Kafka 배치 메시지 발행
                    권한: ROLE_NORMAL(본인)
                    응답: reserveTaskOrderPayId, expiresAt, items(요청된 전체 아이템)
                    """
    )
    @PostMapping(value = "/request-batch", consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<ApiResponse<ReserveAckResponse>> requestPaymentBatch(
            @Parameter(description = "인증 사용자 ID(일반 유저). SecurityContext에서 주입", required = true, example = "10001")
            @AuthUser String userId,
            @RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = BatchReservationRequest.class),
                            examples = @ExampleObject(
                                    name = "장바구니 예약 예시",
                                    value = """
                                    {
                                      "items": [
                                        { "productId": 501, "count": 1, "productSize": "M", "productColor": "BLACK" },
                                        { "productId": 777, "count": 2, "productSize": "L", "productColor": "WHITE" }
                                      ]
                                    }
                                    """
                            )
                    )
            )
            @org.springframework.web.bind.annotation.RequestBody BatchReservationRequest req
    );

    @Operation(
            summary = "예약 상태 조회",
            description = """
                    예약 식별자(RID) 기준으로 현재 상태와 만료 예정 시각(있다면)을 조회합니다.
                    - 상태: ACTIVATED | INACTIVE
                    권한: 제한 없음(클라이언트 폴링용)
                    """
    )
    @GetMapping("/reservations/{rid}")
    ResponseEntity<ApiResponse<ReservationStatusResponse>> reservationStatus(
            @Parameter(description = "예약 식별자(RID)", required = true, example = "20250908-2b8a...-10001")
            @PathVariable("rid") String rid
    );

    @Operation(
            summary = "결제 결과 콜백(RID 단위, 멱등)",
            description = """
                    결제 결과를 RID 단위로 반영합니다(단건/배치 공용).
                    - success=true: 예약 정리(타이머 제거) — 결제 성공
                    - success=false: 즉시 재고 복구 — 결제 실패
                    권한: 시스템/프론트 콜백 엔드포인트(내부 인증 체계로 보호 권장)
                    """
    )
    @PostMapping("/response-by-reserve")
    ResponseEntity<ApiResponse<Void>> finalizeByReserve(
            @Parameter(description = "예약 식별자(RID)", required = true, example = "20250908-2b8a...-10001")
            @RequestParam String reserveTaskOrderPayId,
            @Parameter(description = "성공 여부", required = true, example = "true")
            @RequestParam boolean success
    );

    @Operation(
            summary = "결제 의도 생성(INIT)",
            description = """
                    결제 페이지에서 쿠폰/포인트 적용 후 서버 기준 금액으로 결제 의도를 생성합니다.
                    - 의도 만료시간은 재고 예약 TTL과 정합해야 합니다
                    - 유효성: orderId 중복 불가, lines 비어있지 않아야 함, 포인트 0 이상
                    권한: ROLE_NORMAL(본인)
                    """
    )
    @PostMapping(value = "/intents", consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<ApiResponse<PaymentCommandService.CreateIntentResponse>> createIntent(
            @Parameter(description = "인증 사용자 ID(일반 유저). SecurityContext에서 주입", required = true, example = "10001")
            @AuthUser String authUserId,
            @RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = PaymentCommandService.CreateIntentRequest.class),
                            examples = @ExampleObject(
                                    name = "결제 의도 생성 예시",
                                    value = """
                                    {
                                      "orderId": "ORD-20250908-0001",
                                      "currency": "KRW",
                                      "pointsToUse": 2000,
                                      "expiresAt": "2025-09-08T14:00:00",
                                      "lines": [
                                        { "productId": 501, "size": "M", "color": "BLACK", "quantity": 1, "couponWalletId": 3001 },
                                        { "productId": 777, "size": "L", "color": "WHITE", "quantity": 2 }
                                      ]
                                    }
                                    """
                            )
                    )
            )
            @org.springframework.web.bind.annotation.RequestBody PaymentCommandService.CreateIntentRequest req
    );

    @Operation(
            summary = "PG 성공 콜백 — 승인 처리",
            description = """
                외부 PG 성공 후 서버에 승인 처리 요청을 보냅니다.
                - 서버가 계산한 금액(serverTotal - pointsToUse)과 PG 금액이 일치해야 승인
                - 실패 시 상태를 FAILED로 기록하고 사유 저장
                권한: ROLE_NORMAL(본인)
                """
    )
    @GetMapping("/success")
    ResponseEntity<ApiResponse<Void>> success(
            @Parameter(description = "결제 수단 타입(e.g. CARD)", required = true, example = "CARD")
            @RequestParam String paymentType,
            @Parameter(description = "PG 승인 금액", required = true, example = "12345")
            @RequestParam long amount,
            @Parameter(description = "주문 ID", required = true, example = "ORD-20250908-0001")
            @RequestParam String orderId,
            @Parameter(description = "PG 결제키", required = true, example = "pay_abcdefgh123456")
            @RequestParam String paymentKey
    );

    @Operation(
            summary = "PG 실패 콜백 — 실패 기록",
            description = """
                외부 PG 실패 후 서버에 실패 처리를 요청합니다.
                - 상태를 FAILED로 기록하고 PG 실패 코드/메시지 저장
                권한: ROLE_NORMAL(본인)
                """
    )
    @GetMapping("/fail")
    ResponseEntity<ApiResponse<Void>> fail(
            @Parameter(description = "PG 실패 코드", required = true, example = "AMOUNT_MISMATCH")
            @RequestParam String code,
            @Parameter(description = "PG 실패 메시지", required = true, example = "PG금액과 서버금액 불일치")
            @RequestParam String message,
            @Parameter(description = "주문 ID", required = true, example = "ORD-20250908-0001")
            @RequestParam String orderId
    );

    /* ======================== 결제 내역 조회 ======================== */

    @Operation(
            summary = "내 결제 내역(일반 유저)",
            description = """
                    로그인한 일반 유저의 결제 내역을 페이지로 조회합니다.
                    - 정렬: createdAt DESC 기본
                    - 항목: orderId, 구매자, 상태, 통화, 의도만료, 승인금액, 환불누계, 생성/승인 시각,
                           각 라인별 상품명/옵션/수량/라인상태
                    권한: ROLE_NORMAL(본인)
                    """
    )
    @GetMapping("/my")
    ResponseEntity<ApiResponse<Page<PaymentViewDtos.PaymentSummaryDto>>> myPayments(
            @Parameter(description = "인증 사용자 ID(일반 유저). SecurityContext에서 주입", required = true, example = "10001")
            @AuthUser String authUserId,
            @ParameterObject Pageable pageable
    );

    @Operation(
            summary = "내 판매 결제 내역(브랜드 유저)",
            description = """
                    로그인한 브랜드 유저가 등록한 상품에 대해 발생한 결제 내역을 페이지로 조회합니다.
                    - 정렬: createdAt DESC 기본
                    - 항목: 주문/구매자/상태/통화/TTL/승인/환불/시간 + 라인별 상품명/옵션/수량/라인상태
                    권한: ROLE_BRAND(본인)
                    """
    )
    @GetMapping("/brand/my")
    ResponseEntity<ApiResponse<Page<PaymentViewDtos.PaymentSummaryDto>>> brandPayments(
            @Parameter(description = "인증 사용자 ID(브랜드 유저). SecurityContext에서 주입", required = true, example = "20001")
            @AuthUser String authUserId,
            @ParameterObject Pageable pageable
    );

    @Operation(
            summary = "결제 내역(어드민) — 필터 조회",
            description = """
                    어드민이 다양한 조건으로 결제 내역을 페이지 조회합니다.
                    - orderId 단건 조회(우선)
                    - buyerUserNumber(일반 유저 번호)로 필터
                    - brandUserNumber(브랜드 유저 번호)로 필터
                    - status로 필터
                    - 아무 필터도 없으면 전체 조회(최신순)
                    권한: ROLE_SUPER
                    """
    )
    @GetMapping("/admin")
    ResponseEntity<ApiResponse<Page<PaymentViewDtos.PaymentSummaryDto>>> adminPayments(
            @Parameter(description = "주문 ID(단건 우선 조회)", required = false, example = "ORD-20250908-0001")
            @RequestParam(required = false) String orderId,
            @Parameter(description = "구매자(일반 유저) 번호", required = false, example = "10001")
            @RequestParam(required = false) Long buyerUserNumber,
            @Parameter(description = "브랜드 유저 번호", required = false, example = "20001")
            @RequestParam(required = false) Long brandUserNumber,
            @Parameter(description = "결제 상태(INIT/APPROVED/CANCELLED/FAILED/EXPIRED/REFUNDED)", required = false, example = "APPROVED")
            @RequestParam(required = false) PaymentStatus status,
            @ParameterObject Pageable pageable
    );

    @Operation(
            summary = "결제 상세(통합) — NORMAL/BRAND/SUPER",
            description = """
                    단일 결제의 상세 정보를 조회합니다. 접근 권한:
                    - NORMAL: 본인 결제만
                    - BRAND: 라인 중 하나 이상이 본인 소유 상품인 결제만
                    - SUPER: 전체
                    응답: Payment + 모든 PaymentIntentLine 상세(가격 스냅샷/쿠폰·포인트 배분/최종금액/라인상태 등)
                    """
    )
    @GetMapping("/{paymentId}")
    ResponseEntity<ApiResponse<PaymentViewDtos.PaymentDetailDto>> paymentDetail(
            @Parameter(description = "인증 사용자 ID(SecurityContext에서 주입). 역할에 따라 권한 검사", required = true, example = "10001")
            @AuthUser String authUserId,
            @Parameter(description = "결제 ID", required = true, example = "9001")
            @PathVariable Long paymentId
    );
}
