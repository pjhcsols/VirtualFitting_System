package basilium.basiliumserver.domain.payment.service;

import basilium.basiliumserver.domain.payment.dto.payment.RequestTaskInfo;
import basilium.basiliumserver.domain.payment.dto.payment.ReserveAckResponse;
import basilium.basiliumserver.domain.payment.dto.payment.ReservationStatusResponse;
import basilium.basiliumserver.domain.payment.entity.ReserveStatus;
import basilium.basiliumserver.domain.product.entity.Color;
import basilium.basiliumserver.domain.product.entity.Size;
import basilium.basiliumserver.domain.product.service.ProductService;
import basilium.basiliumserver.domain.product.sse.SseController;
import basilium.basiliumserver.properties.KafkaPaymentReservationProperties;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentService {

    private final KafkaPaymentReservationProperties props;
    private final ProductService productService;
    @Qualifier("paymentReservationScheduler")
    private final ScheduledThreadPoolExecutor scheduler;

    /** TTL/ETA */
    public int ttlMinutes() { return (int) Math.max(1, props.getTtlMinutes()); }
    public LocalDateTime defaultExpiresAtNow() { return LocalDateTime.now().plusMinutes(ttlMinutes()); }

    /* =========================
     *   In-memory (맵 2개)
     * ========================= */

    /** RID -> 번들(아이템/타이머/ETA/시그니처키) */
    private final ConcurrentHashMap<String, Bundle> ridBundles = new ConcurrentHashMap<>();

    /** 전역 인덱스: (CompositeKey | SignatureKey) -> RID */
    private final ConcurrentHashMap<IndexKey, String> index = new ConcurrentHashMap<>();

    /** 번들 정의 */
    static final class Bundle {
        final ConcurrentHashMap<CompositeKey, RequestTaskInfo> items = new ConcurrentHashMap<>();
        final AtomicBoolean scheduled = new AtomicBoolean(false); // 타이머 1회 보장
        final AtomicReference<Optional<ScheduledFuture<?>>> futureRef = new AtomicReference<>(Optional.empty());
        volatile LocalDateTime expiresAt;
        final AtomicReference<SignatureKey> signatureKey = new AtomicReference<>(); // 배치 완전일치 인덱스 제거용

        // 감사 로그 누적 버퍼(아이템 추가 시 O(1) append; 출력 시 루프 없음)
        final StringBuilder auditListBuf = new StringBuilder(256);

        // 선점 로그는 RID 당 1회 (CAS 보장)
        final AtomicBoolean preLoggedOnce = new AtomicBoolean(false);

        // 파라미터(b)로 동기화 금지 → 전용 락 객체 사용
        final Object auditLock = new Object();
    }


    /* =========================
     *     키 타입 (타입 안전)
     * ========================= */

    /** 마커 인터페이스 */
    private sealed interface IndexKey permits CompositeKey, SignatureKey {}

    /** 단건 중복 체크용 키: userId+product+count+size+color */
    private record CompositeKey(String userId, Long productId, Long count, Size size, Color color)
            implements IndexKey {}

    /** 옵션식별 키: productId + size + color (배치 합산용) */
    private record OptionKey(Long productId, Size size, Color color) {}

    /** 배치 완전일치용 키: userId + (옵션→합계수량) 맵(불변, 순서무관) */
    private record SignatureKey(String userId, Map<OptionKey, Long> parts) implements IndexKey {
        // ✅ 컴팩트 생성자 대신 "캐노니컬 생성자"로 정의
        public SignatureKey(String userId, Map<OptionKey, Long> parts) {
            this.userId = Objects.requireNonNull(userId, "userId");
            // 불변/순서무관 보장 (Map.copyOf)
            this.parts  = Map.copyOf(java.util.Objects.requireNonNull(parts, "parts"));
        }
    }



    /* =========================
     *           Utils
     * ========================= */

    /** 상세 감사 로그 전용 로거(별도 appender 권장) */
    private static final Logger AUDIT = LoggerFactory.getLogger("payment-audit");

    private void snapshot(String tag) {
        // ★ DEBUG 아닐 땐 즉시 리턴 (루프/스트림 계산 없음)
        //if (!log.isDebugEnabled()) return;
        if (!log.isInfoEnabled()) return;

        final int ridCnt  = ridBundles.size();
        final int itemCnt = ridBundles.values().stream().mapToInt(b -> b.items.size()).sum();
        final int idxSize = index.size();
        final int qSize   = scheduler.getQueue().size();
        log.info("[STATE@{}] rid={}, items={}, index={}, schedulerQueue={}", tag, ridCnt, itemCnt, idxSize, qSize);
    }

    /** 요청 멀티셋을 (옵션기준 합산)한 SignatureKey 생성 — 문자열/구분자 전혀 없음 */
    public SignatureKey buildSignatureKey(String userId, List<RequestTaskInfo> items) {
        final List<RequestTaskInfo> safe = Optional.ofNullable(items).orElseGet(List::of);
        if (safe.isEmpty()) {
            return new SignatureKey(userId, Map.of());
        }
        var merged = new HashMap<OptionKey, Long>(Math.max(4, safe.size() * 2));
        for (var it : safe) {
            var ok = new OptionKey(it.getProductId(), it.getProductSize(), it.getProductColor());
            merged.merge(ok, it.getCount(), Long::sum);
        }
        return new SignatureKey(userId, merged);
    }


    /* =========================
     *   Duplicate Probe (O(1))
     * ========================= */

    /** 단건 사양 O(1) 조회 */
    public Optional<String> existingRidFor(String userId, Long productId, Long count, Size size, Color color) {
        return Optional.ofNullable(index.get(new CompositeKey(userId, productId, count, size, color)));
    }

    /** 배치 "완전 동일 멀티셋" O(1) 조회 (순서무관, 옵션합산 기준) */
    public Optional<String> existingRidForAny(String userId, List<RequestTaskInfo> items) {
        return Optional.ofNullable(index.get(buildSignatureKey(userId, items)));
    }

    /** 배치 시그니처 선점 (경쟁 시 기존 RID 반환) */
    public Optional<String> registerSignatureIfAbsent(SignatureKey sigKey, String rid) {
        return Optional.ofNullable(index.putIfAbsent(sigKey, rid));
    }

    /** 번들에 시그니처 바인딩 (정리/만료 시 인덱스 제거용) */
    public void bindRidSignature(String rid, SignatureKey sigKey) {
        java.util.Optional.ofNullable(sigKey).ifPresent(sk ->
                java.util.Optional.ofNullable(ridBundles.get(rid)).ifPresent(b -> {
                    b.signatureKey.set(sk);                 // ← AtomicReference 사용
                    auditPreReserveOnce(rid, b, sk.userId());
                })
        );
    }

    /* =========================
     *        Public APIs
     * ========================= */

    /**
     * 예약 등록(단건/배치 공용):
     * - 동일 CompositeKey가 이미 있으면 기존 RID/ETA 그대로 반환(연장 없음)
     * - 신규면 RID 번들에 추가, 타이머 없으면 생성(1회 보장)
     */
    public ReserveAckResponse addReservation(String rid, RequestTaskInfo info) {
        Objects.requireNonNull(rid, "rid");
        Objects.requireNonNull(info, "info");

        var ck = new CompositeKey(info.getUserId(), info.getProductId(), info.getCount(),
                info.getProductSize(), info.getProductColor());

        // 1) 전역 중복 검사
        String existing = index.putIfAbsent(ck, rid);
        if (existing != null) {
            LocalDateTime eta = Optional.ofNullable(ridBundles.get(existing))
                    .map(b -> b.expiresAt)
                    .orElseGet(this::defaultExpiresAtNow);

            var item = ReserveAckResponse.Item.builder()
                    .productId(info.getProductId())
                    .count(info.getCount())
                    .productSize(info.getProductSize())
                    .productColor(info.getProductColor())
                    .build();
            snapshot("addReservation-duplicate");
            return ReserveAckResponse.single(existing, eta, item);
        }

        // 2) 신규 등록
        final var bundle = ridBundles.computeIfAbsent(rid, r -> new Bundle());
        bundle.items.put(ck, info);
        appendAuditItem(bundle, info); // 감사 버퍼에 O(1) 누적

        // 3) 타이머 1회 보장
        if (bundle.scheduled.compareAndSet(false, true)) {
            final long ttl = ttlMinutes();
            bundle.expiresAt = LocalDateTime.now().plusMinutes(ttl);

            final Runnable task = () -> {
                snapshot("timer-run-before");
                try {
                    // 복구 상세 로그(루프 없이 버퍼 그대로) — 만료 시 1회
                    auditRestoreOnce(rid, bundle);
                    // 만료 → 복구 + 인덱스 제거
                    bundle.items.forEach((key, v) -> {
                        try {
                            productService.restoreProductQuantity(v.getProductId(), v.getProductSize(), v.getProductColor(), v.getCount());
                            SseController.updateInventory(v.getProductId());
                        } catch (Exception ex) {
                            log.error("[restore-on-expire] rid={}, key={}, ex={}", rid, key, ex.toString(), ex);
                        } finally {
                            index.remove(key);
                        }
                    });
                    Optional.ofNullable(bundle.signatureKey.get())
                            .ifPresent(sk -> index.remove(sk, rid));
                    log.info("[RID EXPIRE] rid={}, restoredItems={}", rid, bundle.items.size());
                } finally {
                    ridBundles.remove(rid, bundle);
                    bundle.items.clear(); // GC 힌트
                    snapshot("timer-run-after");
                }
            };

            var f = scheduler.schedule(task, ttl, TimeUnit.MINUTES);
            bundle.futureRef.set(Optional.ofNullable(f));
        }

        var item = ReserveAckResponse.Item.builder()
                .productId(info.getProductId())
                .count(info.getCount())
                .productSize(info.getProductSize())
                .productColor(info.getProductColor())
                .build();
        snapshot("addReservation-ok");
        return ReserveAckResponse.single(rid, bundle.expiresAt, item);
    }

    /**
     * 결제 확정(멱등):
     * - success=true  → 복구 없이 인덱스만 제거
     * - success=false → 전부 복구 후 제거
     * - RID 없음 → 조용히 반환
     */
    public void finalizeByRid(String rid, boolean success) {
        Objects.requireNonNull(rid, "rid");
        Optional.ofNullable(ridBundles.remove(rid)).ifPresent(b -> {
            b.futureRef.get().ifPresent(f -> {
                try { f.cancel(false); }
                catch (Exception e) { log.debug("future cancel failed for rid={}", rid, e); }
            });

            if (success) {
                b.items.keySet().forEach(index::remove);
                Optional.ofNullable(b.signatureKey.get())
                        .ifPresent(sk -> index.remove(sk, rid));
                log.info("[finalize SUCCESS] rid={}, items={}", rid, b.items.size());
                b.items.clear();
                snapshot("finalize-success");
                return;
            }

            // ⬇⬇ 복구 상세 로그(루프 없이 버퍼 그대로) — 실패 확정 시 1회
            auditRestoreOnce(rid, b);

            b.items.forEach((k, v) -> {
                try {
                    productService.restoreProductQuantity(v.getProductId(), v.getProductSize(), v.getProductColor(), v.getCount());
                    SseController.updateInventory(v.getProductId());
                } catch (Exception ex) {
                    log.error("[restore-on-finalize] rid={}, key={}, ex={}", rid, k, ex.toString(), ex);
                } finally {
                    index.remove(k);
                }
            });
            Optional.ofNullable(b.signatureKey.get())
                    .ifPresent(sk -> index.remove(sk, rid));
            log.info("[finalize FAIL→RESTORE] rid={}, restoredItems={}", rid, b.items.size());
            b.items.clear();
            snapshot("finalize-fail");
        });
    }

    /** 롤백 전용: 차감이 없던 배치 실패 시 예약만 제거(복구 없음) */
    /** 롤백 전용(무복구 취소) — 요구사항상 상세 로그는 선점/복구 2회만 찍으므로 여기선 상세 로그 X */
    public void cancelAllNoRestore(String rid) {
        java.util.Optional.ofNullable(ridBundles.remove(rid)).ifPresent(b -> {
            b.futureRef.get().ifPresent(f -> {
                try { f.cancel(false); }
                catch (Exception e) { log.debug("future cancel failed for rid={} (rollback)", rid, e); }
            });
            b.items.keySet().forEach(index::remove);
            java.util.Optional.ofNullable(b.signatureKey.get())
                    .ifPresent(sk -> index.remove(sk, rid));
            log.info("[rollback CANCEL(Transactional rollback 자동 복구 / 결제 재고 복구 Scheduler 취소)] rid={}, removedItems={}", rid, b.items.size());
            b.items.clear();
            snapshot("rollback-cancel");
        });
    }


    /** (옵션) ETA 조회 */
    public Optional<LocalDateTime> getExpiresAt(String rid) {
        return Optional.ofNullable(ridBundles.get(rid)).map(b -> b.expiresAt);
    }

    /** (옵션) 상태 조회 */
    public ReservationStatusResponse getStatus(String rid) {
        return Optional.ofNullable(ridBundles.get(rid))
                .map(b -> new ReservationStatusResponse(rid, ReserveStatus.ACTIVATED, Optional.ofNullable(b.expiresAt)))
                .orElseGet(() -> new ReservationStatusResponse(rid, ReserveStatus.INACTIVE, Optional.empty()));
    }

    @PreDestroy
    void shutdown() {
        try {
            ridBundles.values().forEach(b ->
                    b.futureRef.get().ifPresent(f -> {
                        try { f.cancel(false); }
                        catch (Exception e) { log.debug("ignore cancel failure on shutdown", e); }
                    })
            );
            ridBundles.clear();
            index.clear();
            log.info("[shutdown] PaymentService maps cleared.");
        } finally {
            snapshot("shutdown");
        }
    }


    /* =========================
     *     Audit Helpers (루프 없음)
     * ========================= */

    /** 아이템 1건을 감사 버퍼에 누적 — O(1), 루프 없음 */
    //필요한 이유?
    private static void appendAuditItem(Bundle b, RequestTaskInfo it) {
        synchronized (b.auditLock) {
            if (b.auditListBuf.isEmpty()) {
                b.auditListBuf.append('[');
            } else {
                b.auditListBuf.append(", ");
            }
            b.auditListBuf
                    .append("productId=").append(it.getProductId())
                    .append(", size=").append(it.getProductSize())
                    .append(", color=").append(it.getProductColor())
                    .append(", 수량:").append(it.getCount());
        }
    }


    /** 선점 상세 로그 — RID당 최초 1회만 */
    // 변경 4) 선점 로그 메서드 시그니처 단순화(배치 완료 시점에서 userId 전달)
    private void auditPreReserveOnce(String rid, Bundle b, String userId) {
        if (!AUDIT.isInfoEnabled() || !b.preLoggedOnce.compareAndSet(false, true)) return;

        final String listStr;
        synchronized (b.auditLock) {
            if (b.auditListBuf.isEmpty() || b.auditListBuf.charAt(b.auditListBuf.length() - 1) == ']') {
                listStr = b.auditListBuf.toString();
            } else {
                listStr = b.auditListBuf.append(']').toString();
            }
        }
        AUDIT.info("[결제 재고 선점 사전 요청] userId={}, reserveTaskOrderPayId={}, expiresAt={}, list: {}",
                userId, rid, b.expiresAt, listStr);
    }

    /** 복구 상세 로그 — 만료/실패 확정 시 1회 */
    private void auditRestoreOnce(String rid, Bundle b) {
        if (!AUDIT.isInfoEnabled()) return;

        final String listStr;
        synchronized (b.auditLock) {
            if (b.auditListBuf.isEmpty()) {
                listStr = "[]";
            } else if (b.auditListBuf.charAt(b.auditListBuf.length() - 1) == ']') {
                listStr = b.auditListBuf.toString();
            } else {
                listStr = b.auditListBuf.append(']').toString();
            }
        }

        final String userId = Optional.ofNullable(b.signatureKey.get())
                .map(SignatureKey::userId)
                .orElse("unknown");

        AUDIT.info("[결제 재고 선점 복구 요청] userId={}, reserveTaskOrderPayId={}, expiresAt={}, list: {}",
                userId, rid, b.expiresAt, listStr);
    }
}
