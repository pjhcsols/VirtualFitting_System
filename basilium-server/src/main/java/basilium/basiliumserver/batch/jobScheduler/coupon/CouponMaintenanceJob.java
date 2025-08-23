// src/main/java/basilium/basiliumserver/domain/coupon/batch/CouponMaintenanceJob.java
package basilium.basiliumserver.batch.jobScheduler.coupon;

import basilium.basiliumserver.domain.coupon.repository.BrandCouponCampaignRepository;
import basilium.basiliumserver.domain.coupon.repository.NormalCouponWalletRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.event.EventListener;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;

/**
 * 매일 00:00 KST
 * 1) SCHEDULED → ACTIVE 전이(시작 도래)
 * 2) (SCHEDULED|ACTIVE) → EXPIRED 전이(종료 도래)
 * 3) EXPIRED 캠페인의 모든 지갑 삭제(AVAILABLE/USED 무관)
 * 4) 만료 후 N일(기본 180일) 경과한 캠페인 purge
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CouponMaintenanceJob {

    private final NormalCouponWalletRepository walletRepo;
    private final BrandCouponCampaignRepository campaignRepo;

    // 앱 시작 직후 1회 실행 시, 내부 self-invocation으로 @Transactional이 무력화되지 않도록
    // 스프링 프록시를 통해 동일 빈의 스케줄 메서드를 호출하기 위해 필요
    private final ApplicationContext applicationContext;

    /** 만료 캠페인 보관 기간(일): 만료 후 purge 기준 */
    @Value("${coupon.campaign.purge-after-days:180}")
    private int purgeAfterDays;

    /* ===============================
     * 앱 시작 직후 1회 실행
     * =============================== */
    @EventListener(ApplicationReadyEvent.class)
    public void runOnceOnStartup() {
        try {
            // 같은 클래스 내 메서드 호출은 프록시를 거치지 않으므로, 프록시를 직접 얻어 호출
            log.info("[CouponMaintenanceJob] startup run.");
            applicationContext.getBean(CouponMaintenanceJob.class).maintain();
            log.info("[CouponMaintenanceJob] startup run finished.");
        } catch (Exception e) {
            log.error("[CouponMaintenanceJob] startup run failed.", e);
        }
    }

    /* ===============================
     * 스케줄: 매일 00:00(KST)
     * =============================== */
    @Transactional
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    public void maintain() {
        final LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));

        // 1) 시작 도래한 예약 캠페인 활성화
        final int activated = campaignRepo.activateDueCampaigns(now);

        // 2) 종료 도래 캠페인 만료 처리
        final int expired = campaignRepo.expireEndedCampaigns(now);

        // 3) EXPIRED 캠페인들의 지갑 일괄 삭제 (FK 문제 회피 위해 캠페인 삭제 전 먼저)
        final int deletedWallets = walletRepo.deleteWalletsByExpiredAsOf(now);
        /*
        final List<Long> expiredIds = campaignRepo.findExpiredCampaignIds(now);
        final int deletedWallets = expiredIds.isEmpty()
                ? 0
                : walletRepo.deleteWalletsByCampaignIds(expiredIds);

         */

        // 4) 만료 후 보관기간 경과 캠페인 purge
        final LocalDateTime threshold = now.minusDays(purgeAfterDays);
        final int purged = campaignRepo.purgeExpiredOlderThan(threshold);

        log.info("[CouponMaintenanceJob] activated={}, expired={}, deletedWallets={}, purgedCampaigns={}, now={}",
                activated, expired, deletedWallets, purged, now);
    }
}
