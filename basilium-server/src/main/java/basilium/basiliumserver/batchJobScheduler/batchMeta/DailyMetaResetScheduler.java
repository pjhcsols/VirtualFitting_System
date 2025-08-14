// src/main/java/basilium/basiliumserver/batchJobScheduler/batchMeta/DailyMetaResetScheduler.java
package basilium.basiliumserver.batchJobScheduler.batchMeta;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DailyMetaResetScheduler {

    private final BatchSchemaResetService schemaResetService;
    private final JdbcTemplate jdbcTemplate;

    @Value("${batch.image.job-name}")
    private String imageJobName;

    @Value("${batch.meta.reset.force}")
    private boolean forceReset;

    // 매일 05:10 KST (이미지 배치 04:30 종료 가정)
    @Scheduled(cron = "${batch.meta.reset.cron}", zone = "Asia/Seoul")
    public void resetMetaAfterDailyImageJob() {
        try {
            if (!forceReset && hasRunningExecutions(imageJobName)) {
                log.warn("[BatchMeta] {} 실행중 감지 → 메타 리셋 스킵 (forceReset=false)", imageJobName);
                return;
            }
            log.info("[BatchMeta] daily meta reset start");
            schemaResetService.dropAndCreate();
            log.info("[BatchMeta] daily meta reset done");
        } catch (Exception e) {
            log.error("[BatchMeta] daily meta reset failed", e);
        }
    }

    /** 대상 잡의 실행중 상태 존재 여부 (STARTING/STARTED/STOPPING) */
    private boolean hasRunningExecutions(String jobName) {
        final String sql = """
            SELECT COUNT(*)
            FROM BATCH_JOB_EXECUTION e
            JOIN BATCH_JOB_INSTANCE i ON i.JOB_INSTANCE_ID = e.JOB_INSTANCE_ID
            WHERE i.JOB_NAME = ?
              AND e.STATUS IN ('STARTING','STARTED','STOPPING')
            """;
        Integer cnt = jdbcTemplate.queryForObject(sql, Integer.class, jobName);
        return cnt != null && cnt > 0;
    }
}
