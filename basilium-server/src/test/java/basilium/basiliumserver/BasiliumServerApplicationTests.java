package basilium.basiliumserver;

import basilium.basiliumserver.batch.springBatch.batchMeta.BatchSchemaResetService;
import basilium.basiliumserver.batch.springBatch.image.ImageBatchJobScheduler;
import org.junit.jupiter.api.Test;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.JobRegistry;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.PlatformTransactionManager;

@SpringBootTest(properties = {
		"spring.batch.job.enabled=false",           // 배치 자동 실행 방지
		"spring.main.lazy-initialization=true",     // 지연 초기화
		"spring.batch.jdbc.initialize-schema=never",// 부트의 배치 스키마 자동생성도 차단(보호막)
})
@ActiveProfiles("test")
class BasiliumServerApplicationTests {

	@MockBean JobRegistry jobRegistry;
	@MockBean JobLauncher jobLauncher;
	@MockBean ImageBatchJobScheduler imageBatchJobScheduler;

	// 배치 Job/Step은 이름으로 숏서킷
	@MockBean(name = "imageBatchJob") Job imageBatchJob;
	@MockBean(name = "userImageCleanupStep") Step userImageCleanupStep;

	// 배치 인프라 목
	@MockBean JobRepository jobRepository;
	@MockBean PlatformTransactionManager transactionManager;

	// ⭐ 핵심: 부팅 시 배치 스키마를 리셋/실행하는 러너를 가로막기
	@MockBean(name = "runImageBatchOnStartup")
	ApplicationRunner runImageBatchOnStartup;

	// (선택) 리셋 서비스 자체도 목으로 막아두면 더 안전
	@MockBean BatchSchemaResetService batchSchemaResetService;

	@Test void contextLoads() { }
}
