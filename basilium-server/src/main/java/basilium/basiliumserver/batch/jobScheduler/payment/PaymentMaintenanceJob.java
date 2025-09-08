package basilium.basiliumserver.batch.jobScheduler.payment;

import basilium.basiliumserver.domain.payment.entity.PaymentStatus;
import basilium.basiliumserver.domain.payment.repository.PaymentIntentLineRepository;
import basilium.basiliumserver.domain.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentMaintenanceJob {

    private final PaymentRepository paymentRepo;
    private final PaymentIntentLineRepository lineRepo;

    /** purge 기준 상태 집합: 만료/취소/실패 */
    private static final Set<PaymentStatus> PURGE_STATES =
            EnumSet.of(PaymentStatus.FAILED, PaymentStatus.CANCELLED, PaymentStatus.EXPIRED);

    @EventListener(ApplicationReadyEvent.class)
    public void runOnceOnStartup() {
        try { maintain(); } catch (Exception e) {
            log.error("[PaymentMaintenanceJob] startup run failed.", e);
        }
    }

    /** 매일 00:00(KST) — intent_expires_at 기준 1개월 경과 & (FAILED/CANCELLED/EXPIRED) 전체 정리 */
    @Transactional
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    public void maintain() {
        log.info("[PaymentMaintenanceJob] startup run.");
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
        LocalDateTime threshold = now.minusMonths(1);

        List<Long> ids = paymentRepo.findIdsForPurge(threshold, PURGE_STATES);
        if (ids.isEmpty()) {
            log.info("[PaymentMaintenanceJob] purge 대상 없음. now={}", now);
            return;
        }

        int deletedLines = lineRepo.deleteByPaymentIds(ids);
        int deletedPayments = paymentRepo.deleteByIds(ids);

        log.info("[PaymentMaintenanceJob] purged payments={}, purged lines={}, threshold={}",
                deletedPayments, deletedLines, threshold);
    }
}

