package basilium.basiliumserver.batch.image;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ImageBatchJobScheduler {

    private final JobLauncher jobLauncher;
    private final Job imageBatchJob;

    // 매일 04:30 KST
    @Scheduled(cron = "${batch.image.run.cron}", zone = "Asia/Seoul")
    public void run() {
        try {
            log.info("[Batch] imageBatchJob 시작");
            jobLauncher.run(
                    imageBatchJob,
                    new JobParametersBuilder()
                            .addLong("ts", System.currentTimeMillis()) // 재실행 보장
                            .toJobParameters()
            );
            log.info("[Batch] imageBatchJob 정상 완료");
        } catch (Exception e) {
            log.error("[Batch] imageBatchJob 실행 실패", e);
        }
    }
}
