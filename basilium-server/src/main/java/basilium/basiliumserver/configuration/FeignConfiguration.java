package basilium.basiliumserver.configuration;

import org.springframework.cloud.openfeign.FeignFormatterRegistrar;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.datetime.standard.DateTimeFormatterRegistrar;

//날짜 불일치 레포에 일괄적으로 적용
@Configuration
public class FeignConfiguration {
    @Bean
    public FeignFormatterRegistrar localDateFormatter() {
        return registry -> {
            DateTimeFormatterRegistrar registrar = new DateTimeFormatterRegistrar();
            registrar.setUseIsoFormat(true);
            registrar.registerFormatters(registry);
        };
    }

}
