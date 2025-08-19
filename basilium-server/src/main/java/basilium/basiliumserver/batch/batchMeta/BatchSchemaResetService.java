// src/main/java/basilium/basiliumserver/batchJobScheduler/batchMeta/BatchSchemaResetService.java
package basilium.basiliumserver.batch.batchMeta;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;

@Slf4j
@Service
@RequiredArgsConstructor
public class BatchSchemaResetService {

    private final DataSource dataSource;

    @Value("${spring.batch.jdbc.platform:mysql}")
    private String platform;

    /** Spring Batch 메타 테이블 전부 DROP 후 CREATE (100% 초기화) */
    public void dropAndCreate() {
        final String drop = "org/springframework/batch/core/schema-drop-" + platform + ".sql";
        final String create = "org/springframework/batch/core/schema-" + platform + ".sql";

        log.info("[BatchMeta] DROP start (script={})", drop);
        ResourceDatabasePopulator dropPop = new ResourceDatabasePopulator(new ClassPathResource(drop));
        dropPop.setContinueOnError(true);   // 존재하지 않아도 통과
        dropPop.execute(dataSource);
        log.info("[BatchMeta] DROP done");

        log.info("[BatchMeta] CREATE start (script={})", create);
        ResourceDatabasePopulator createPop = new ResourceDatabasePopulator(new ClassPathResource(create));
        createPop.setContinueOnError(false); // 실패 시 중단
        createPop.execute(dataSource);
        log.info("[BatchMeta] CREATE done");
    }
}
