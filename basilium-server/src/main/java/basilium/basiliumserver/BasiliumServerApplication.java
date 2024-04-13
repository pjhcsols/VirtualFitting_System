package basilium.basiliumserver;

import javax.sql.DataSource;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cloud.openfeign.FeignAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

@EnableFeignClients
@SpringBootApplication
@ImportAutoConfiguration({FeignAutoConfiguration.class})
public class BasiliumServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(BasiliumServerApplication.class, args);


	}

	@Bean
	public ApplicationRunner initializeDatabase(DataSource dataSource) {
		return args -> {
			ResourceDatabasePopulator populator = new ResourceDatabasePopulator(
					new ClassPathResource("data.sql"));
			populator.execute(dataSource);
		};
	}

}
