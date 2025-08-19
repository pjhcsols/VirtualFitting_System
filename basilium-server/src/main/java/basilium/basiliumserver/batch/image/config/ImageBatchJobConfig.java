package basilium.basiliumserver.batch.image.config;

import basilium.basiliumserver.batch.image.service.ImageBatchCleanupService;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
public class ImageBatchJobConfig {

    @Bean
    public Step userImageCleanupStep(JobRepository jobRepository,
                                     PlatformTransactionManager tx,
                                     ImageBatchCleanupService svc) {
        return new StepBuilder("userImageCleanupStep", jobRepository)
                .allowStartIfComplete(true)
                .tasklet((c, cc) -> { svc.cleanupUserImages(); return RepeatStatus.FINISHED; }, tx)
                .build();
    }

    @Bean
    public Step profileImageCleanupStep(JobRepository jobRepository,
                                        PlatformTransactionManager tx,
                                        ImageBatchCleanupService svc) {
        return new StepBuilder("profileImageCleanupStep", jobRepository)
                .allowStartIfComplete(true)
                .tasklet((c, cc) -> { svc.cleanupProfileImages(); return RepeatStatus.FINISHED; }, tx)
                .build();
    }

    @Bean
    public Step reviewImageCleanupStep(JobRepository jobRepository,
                                       PlatformTransactionManager tx,
                                       ImageBatchCleanupService svc) {
        return new StepBuilder("reviewImageCleanupStep", jobRepository)
                .allowStartIfComplete(true)
                .tasklet((c, cc) -> { svc.cleanupReviewImages(); return RepeatStatus.FINISHED; }, tx)
                .build();
    }

    @Bean
    public Step businessCertCleanupStep(JobRepository jobRepository,
                                        PlatformTransactionManager tx,
                                        ImageBatchCleanupService svc) {
        return new StepBuilder("businessCertCleanupStep", jobRepository)
                .allowStartIfComplete(true)
                .tasklet((c, cc) -> { svc.cleanupBusinessCertImages(); return RepeatStatus.FINISHED; }, tx)
                .build();
    }

    @Bean
    public Step superBannerCleanupStep(JobRepository jobRepository,
                                       PlatformTransactionManager tx,
                                       ImageBatchCleanupService svc) {
        return new StepBuilder("superBannerCleanupStep", jobRepository)
                .allowStartIfComplete(true)
                .tasklet((c, cc) -> { svc.cleanupSuperBanners(); return RepeatStatus.FINISHED; }, tx)
                .build();
    }

    @Bean
    public Job imageBatchJob(JobRepository jobRepository,               // ← 여기서도 파라미터로 받기
                             Step userImageCleanupStep,
                             Step profileImageCleanupStep,
                             Step reviewImageCleanupStep,
                             Step businessCertCleanupStep,
                             Step superBannerCleanupStep) {
        return new JobBuilder("imageBatchJob", jobRepository)
                .start(userImageCleanupStep)
                .next(profileImageCleanupStep)
                .next(reviewImageCleanupStep)
                .next(businessCertCleanupStep)
                .next(superBannerCleanupStep)
                .build();
    }
}

