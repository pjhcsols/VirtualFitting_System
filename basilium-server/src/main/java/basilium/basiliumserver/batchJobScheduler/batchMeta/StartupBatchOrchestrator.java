// src/main/java/basilium/basiliumserver/batchJobScheduler/batchMeta/StartupBatchOrchestrator.java
package basilium.basiliumserver.batchJobScheduler.batchMeta;

import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.core.annotation.Order;


/*
 * # 앱 시작 시: 메타테이블 드롭 → 생성 → 이미지 배치 1회 실행 → 이후 매일 스케줄러로 배치 실행 + 리셋
 * ※ 핵심: 스프링 부트의 자동 스키마 생성 타이밍과 충돌 없이 100% 초기화 보장하려면, 부팅 시점에는 우리가 직접 드롭/생성->“하루 보존(=사실상 매일 image 리셋)” 정책을 안정적으로 만족해야됨.
 *
 * 부팅 →
DataSource/JPA 준비 →
Hibernate ddl-auto=create (테이블 생성) →
[ApplicationRunner #1] initializeDatabase (data.sql 주입) →
[ApplicationRunner #2] runImageBatchOnStartup
   ├─ Batch 메타 스키마 DROP → CREATE
   └─ imageBatchJob 1회 실행
→ 스케줄러 대기 (매일 04:30 배치, 05:10 메타리셋)
 */
@Slf4j
@Configuration
public class StartupBatchOrchestrator {

    @Value("${batch.startup.orchestrate:true}")
    private boolean orchestrateOnStartup;

    @Bean
    @Order(2)
    @DependsOn({"entityManagerFactory", "initializeDatabase"})
    public ApplicationRunner runImageBatchOnStartup(BatchSchemaResetService schemaResetService,
                                                    JobLauncher jobLauncher,
                                                    @Qualifier("imageBatchJob") Job imageBatchJob) {
        return args -> {
            if (!orchestrateOnStartup) {
                log.info("[Startup] orchestrateOnStartup=false → 부팅시 오케스트레이션 스킵");
                return;
            }
            schemaResetService.dropAndCreate();
            log.info("[Startup] imageBatchJob run start");
            JobExecution exec = jobLauncher.run(
                    imageBatchJob,
                    new JobParametersBuilder()
                            .addLong("ts", System.currentTimeMillis())
                            .addString("startup", "true")
                            .toJobParameters()
            );
            log.info("[Startup] imageBatchJob finished with status={}", exec.getStatus());
        };
    }
}