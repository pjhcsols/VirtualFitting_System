package basilium.basiliumserver;

import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cloud.openfeign.FeignAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@EnableScheduling
@EnableTransactionManagement
//위 스케줄링
@EnableFeignClients
@SpringBootApplication
@ConfigurationPropertiesScan("basilium.basiliumserver.properties")
@ImportAutoConfiguration({FeignAutoConfiguration.class})
public class BasiliumServerApplication {

	private static final Logger logger = LoggerFactory.getLogger(BasiliumServerApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(BasiliumServerApplication.class, args);
	}

	@Bean
	public ApplicationRunner initializeDatabase(DataSource dataSource) {
		return args -> {
			try {
				ResourceDatabasePopulator populator = new ResourceDatabasePopulator(
						new ClassPathResource("data.sql"));
				populator.execute(dataSource);
				logger.info("Database initialized successfully");
			} catch (Exception e) {
				logger.error("Database initialization failed: {}", e.getMessage());
				logger.error("Exception stack trace: ", e);
			}
		};
	}

}
