// src/main/java/basilium/basiliumserver/domain/cart/controller/apiDocs/CartApiDocs.java
package basilium.basiliumserver.domain.cart.controller.apiDocs;

import basilium.basiliumserver.domain.cart.dto.CartDtos;
import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.auth.support.AuthUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Cart API 문서
 * - 대상: ROLE_NORMAL(일반 사용자)
 * - 기능: 장바구니 생성/조회/추가/수정/삭제 + 합계 미리보기
 *
 * 핵심 규칙
 * 1) POST /me  (만능 엔드포인트)
 *    - 바디가 없으면: 장바구니가 없을 시 생성 후 조회(created=true), 있으면 그대로 조회(created=false)
 *    - 바디가 있으면: 장바구니가 없을 시 생성 후 아이템 추가, 있으면 추가 → 전체 뷰 반환
 *    - 반환 뷰: items + totalLines + TotalsView(브랜드할인 적용 + 최적 쿠폰 1장 적용; 라인별 비례배분)
 *
 * 2) GET /me/peek
 *    - 생성 부수효과 없이 조회만 수행(없으면 빈 카트 created=false)
 *
 * 3) POST /me/items, /me/items/bulk
 *    - 카트가 없으면 생성 후 반영
 *    - 동일 옵션은 수량 증가 / bulk는 동일 옵션 합산 후 반영
 *
 * 금액 규칙 요약
 * - 브랜드 할인(%): 상품 단가에 HALF_UP 적용 → 라인 금액 합산
 * - 쿠폰: 보유 지갑 중 유효한 1장만 최적 선택(BRAND/PRODUCT 스코프, minOrder, maxDiscount 캡)
 * - 최적 쿠폰 할인액을 적용 대상 라인에 비례배분(HALF_UP, 합계 보정)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ✅ 최신 업데이트(2025-11-01 KST)
 * • /me 단일 엔드포인트에서 “없으면 생성+조회 / 있으면 추가 후 전체 반환” 통합 제공.
 * • 동시성 제어: Cart 행에 대해 PESSIMISTIC_WRITE(SELECT ... FOR UPDATE) + 짧은 재시도(총 3회).
 * • 조기 오류 감지: 비즈니스 처리 후 즉시 flush하여 UNIQUE/락 위반을 조기 검출.
 * • 캐시 사용으로 읽기 경로 성능 개선(가격/브랜드/할인%는 캐시, 재고/사진은 실시간).
 *
 * ⏱ 캐시 사양(CachedCatalogReader 기준)
 * • Product 기본정보 캐시(이름/가격/총재고/브랜드표시):
 *   - TTL: 60초
 *   - 키: productId, 배치 조회 지원(일괄 로딩)
 *   - 일관성: 60초 내 변경은 조회에 지연 반영될 수 있으나, 최종 결제 단계에서 재계산으로 정합성 보장
 * • 활성 브랜드 할인 퍼센트 캐시:
 *   - TTL: 60초 (분 단위 윈도우)
 *   - 키: productId(+시간버킷)
 *   - 일관성: 최대 60초 지연 가능, 결제 승인 시 서버 금액 재검증으로 정합성 보장
 * • 실시간 조회(캐시 미사용):
 *   - 옵션 재고 수량(ProductOption.optionQuantity) — 항상 DB 실시간
 *   - 색상별 대표 이미지 목록 — DB 조회(1차 캐시/Hibernate 컨텍스트 + Batch 전략 활용)
 *
 * 🔒 트랜잭션/락 시도 정책
 * • Cart 조회/수정: PESSIMISTIC_WRITE + lock timeout 3초(시도당)
 * • 재시도: 실패 시 짧은 backoff(약 30ms → 60ms)로 최대 2회 재시도(총 3회 시도)
 * • flush 시점: 로직 수행 직후 EntityManager.flush()로 UNIQUE/락 위반을 조기 감지
 *
 * ⚙️ 성능 명세
 * • 쓰기 경로(추가/수정/삭제):
 *   - 정확성 우선: 상품상태/옵션재고는 항상 실시간 검증(캐시 미사용)
 *   - Cart 단건 락으로 동일 유저 경쟁 쓰기 직렬화
 *   - 동일 옵션 병합/수량 클램핑으로 불필요한 라인 증가 방지
 * • 읽기 경로(조회/합계 미리보기):
 *   - Product 기본정보/할인%는 캐시(각 60초)로 DB 부하 절감
 *   - 옵션재고/사진은 필요한 키만 일괄 로딩(배치/인덱스 기반), N+1 회피
 *   - 쿠폰은 “최적 1장” 탐색 + 라인 비례배분(HALF_UP)로 최종 합계 정확 매칭
 */
@Tag(name = "장바구니", description = "일반 유저 장바구니(Cart / CartItem) CRUD 및 합계 미리보기 API")
@RequestMapping("/b1/carts")
public interface CartApiDocs {

    @Operation(
            summary = "내 장바구니 접근(/me 만능)",
            description = """
                    - ROLE_NORMAL 전용.
                    - 요청 바디가 **없으면**: 장바구니가 없을 경우 생성 후 조회(created=true), 이미 있으면 그대로 조회(created=false).
                    - 요청 바디가 **있으면**: 장바구니가 없을 경우 생성 후 아이템들 추가, 이미 있으면 추가만 수행한 뒤 전체 뷰 반환.
                    - 아이템 추가 시: 동일 옵션은 수량 증가, 옵션 재고 검증(판매중/옵션 존재/잔여수량) 즉시 수행.
                    - 합계 미리보기: 가격/브랜드/할인%는 캐시(각 60초) 사용, 옵션재고/이미지는 실시간 조회.
                    - 동시성 제어: Cart 행 PESSIMISTIC_WRITE(락 타임아웃 3초/시도), 실패 시 30ms→60ms 백오프로 최대 2회 재시도(총 3회).
                    - 반환 항목: items(상품명/브랜드/옵션/수량/대표이미지/옵션재고/라인별 금액 구성), totalLines, 
                      TotalsView(original, brandDiscount, couponDiscount(best-1), finalPayable), created 플래그.
                    """
            ,
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = false,
                    content = @Content(schema = @Schema(implementation = CartDtos.AddItemsReq.class))
            )
    )
    @PostMapping("/me")
    ResponseEntity<ApiResponse<CartDtos.CartView>> ensureAndGetOrAdd(
            @Parameter(description = "인증 사용자 ID(NormalUser.id)", required = true)
            @AuthUser String authUserId,
            @RequestBody(required = false) CartDtos.AddItemsReq req
    );

    /*
    @Operation(
        summary = "내 장바구니 조회(없으면 생성)",
        description = """
                - ROLE_NORMAL 전용.
                - 최초 접근 시 장바구니가 없으면 생성 후 반환(created=true).
                - 반환 항목: items(상품/옵션/수량/브랜드), totalLines, 합계 미리보기(브랜드할인+최적 쿠폰 1장).
                """
    )
    @GetMapping("/me")
    ResponseEntity<ApiResponse<CartDtos.CartView>> ensureAndGet(
            @Parameter(description = "인증 사용자 ID(NormalUser.id)", required = true)
            @AuthUser String authUserId
    );
     */

    @Operation(
            summary = "내 장바구니 조회(생성 없이: peek)",
            description = """
                    - 생성/수정 부수효과 없이 조회만 수행합니다.
                    - 장바구니가 없으면 빈 결과(created=false, items=[])를 반환합니다.
                    - 합계 미리보기(브랜드할인 + 최적 쿠폰 1장)는 캐시(가격/브랜드/할인% 각 60초)를 활용하되,
                      옵션 재고/대표 이미지는 항상 실시간으로 반영됩니다.
                    """
    )
    @GetMapping("/me/peek")
    ResponseEntity<ApiResponse<CartDtos.CartView>> peek(
            @Parameter(description = "인증 사용자 ID(NormalUser.id)", required = true)
            @AuthUser String authUserId
    );

    @Operation(
            summary = "아이템 1건 추가(동일 옵션은 수량 증가; 없으면 카트 생성)",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(schema = @Schema(implementation = CartDtos.AddItemReq.class))
            ),
            description = """
                    - 카트가 없으면 생성 후 반영합니다.
                    - 유효성: 판매중 상품/존재하는 옵션/잔여수량은 **실시간 DB**로 검증(캐시 미사용).
                    - 동시성: Cart 행 PESSIMISTIC_WRITE + 락 타임아웃 3초/시도, 실패 시 30ms→60ms 백오프로 최대 2회 재시도(총 3회).
                    - 반환: 추가 반영 후 전체 카트 뷰(합계 포함). 합계 계산 시 가격/브랜드/할인%는 60초 캐시 사용.
                    """
    )
    @PostMapping("/me/items")
    ResponseEntity<ApiResponse<CartDtos.CartView>> addItem(
            @Parameter(description = "인증 사용자 ID(NormalUser.id)", required = true)
            @AuthUser String authUserId,
            @RequestBody CartDtos.AddItemReq req
    );

    @Operation(
            summary = "아이템 여러건 추가(중복 옵션 합산; 없으면 카트 생성)",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(schema = @Schema(implementation = CartDtos.AddItemsReq.class))
            ),
            description = """
                - 요청 내 동일 옵션은 서버에서 합쳐서 한 번에 반영합니다.
                - 각 옵션별 재고/상태 검증은 **실시간 DB**로 수행(캐시 미사용), 초과 수량은 자동 클램핑.
                - 동시성: Cart 행 PESSIMISTIC_WRITE + 락 타임아웃 3초/시도, 실패 시 30ms→60ms 백오프로 최대 2회 재시도(총 3회).
                - 반환: 추가 반영 후 전체 카트 뷰(합계 포함). 합계 계산 시 가격/브랜드/할인%는 60초 캐시 사용.
                """
    )
    @PostMapping("/me/items/bulk")
    ResponseEntity<ApiResponse<CartDtos.CartView>> addItems(
            @Parameter(description = "인증 사용자 ID(NormalUser.id)", required = true)
            @AuthUser String authUserId,
            @RequestBody CartDtos.AddItemsReq req
    );

    @Operation(
            summary = "아이템 수정(옵션/수량 변경; 병합/삭제 규칙 포함)",
            description = """
                    - 수량<=0이면 해당 라인을 삭제합니다.
                    - 옵션 변경 시 동일 옵션 라인이 존재하면 병합 후 총 수량을 재고 한도 내로 맞춥니다.
                    - 검증은 **실시간 DB**(상태/옵션/잔여수량) 기반, 금액 미리보기는 60초 캐시 활용.
                    - 동시성: Cart 행 PESSIMISTIC_WRITE + 락 타임아웃 3초/시도, 실패 시 30ms→60ms 백오프로 최대 2회 재시도(총 3회).
                    """
    )
    @PatchMapping("/me/items/{itemId}")
    ResponseEntity<ApiResponse<CartDtos.CartView>> updateItem(
            @Parameter(description = "인증 사용자 ID(NormalUser.id)", required = true)
            @AuthUser String authUserId,
            @PathVariable Long itemId,
            @RequestBody CartDtos.UpdateItemReq req
    );

    @Operation(
            summary = "아이템들 삭제(itemId 목록)",
            description = """
                    - 전달된 itemId 목록에 해당하는 라인들을 삭제합니다.
                    - 모든 라인이 제거되면 카트 자체도 삭제됩니다.
                    - 동시성: Cart 행 PESSIMISTIC_WRITE + 락 타임아웃 3초/시도, 실패 시 30ms→60ms 백오프로 최대 2회 재시도(총 3회).
                    - 반환: 삭제 반영 후 전체 카트 뷰(비면 빈 결과). 합계 계산은 60초 캐시 활용.
                    """
    )
    @DeleteMapping("/me/items")
    ResponseEntity<ApiResponse<CartDtos.CartView>> removeItems(
            @Parameter(description = "인증 사용자 ID(NormalUser.id)", required = true)
            @AuthUser String authUserId,
            @RequestParam List<Long> itemIds
    );

    @Operation(
            summary = "옵션으로 삭제(상품/사이즈/색상 완전 일치 라인 제거)",
            description = """
                    - productId/size/color가 완전 일치하는 라인을 모두 제거합니다.
                    - 모든 라인이 제거되면 카트 자체도 삭제됩니다.
                    - 동시성: Cart 행 PESSIMISTIC_WRITE + 락 타임아웃 3초/시도, 실패 시 30ms→60ms 백오프로 최대 2회 재시도(총 3회).
                    - 반환: 삭제 반영 후 전체 카트 뷰(비면 빈 결과). 합계 계산은 60초 캐시 활용.
                    """
    )
    @DeleteMapping("/me/items/by-option")
    ResponseEntity<ApiResponse<CartDtos.CartView>> removeByOption(
            @Parameter(description = "인증 사용자 ID(NormalUser.id)", required = true)
            @AuthUser String authUserId,
            @RequestParam Long productId,
            @RequestParam String size,
            @RequestParam String color
    );

    @Operation(
            summary = "전체 비우기(카트 삭제)",
            description = """
                    - 모든 라인을 비우고 카트 엔티티도 삭제합니다.
                    - 동시성: Cart 행 PESSIMISTIC_WRITE + 락 타임아웃 3초/시도, 실패 시 30ms→60ms 백오프로 최대 2회 재시도(총 3회).
                    - 반환: 본문 없는 성공 응답(ApiResponse<Void>).
                    """
    )
    @DeleteMapping("/me")
    ResponseEntity<ApiResponse<Void>> clearAll(
            @Parameter(description = "인증 사용자 ID(NormalUser.id)", required = true)
            @AuthUser String authUserId
    );
}
