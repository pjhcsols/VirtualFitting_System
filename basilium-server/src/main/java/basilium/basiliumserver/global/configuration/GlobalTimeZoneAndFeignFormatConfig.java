package basilium.basiliumserver.global.configuration;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FeignFormatterRegistrar;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.datetime.standard.DateTimeFormatterRegistrar;

import java.time.ZonedDateTime;
import java.util.TimeZone;

/**
 * 전역 타임존(KST) 설정 + Feign 날짜 포맷(ISO-8601) 설정 통합 구성
 */
@Slf4j
@Configuration
public class GlobalTimeZoneAndFeignFormatConfig {

    /** JVM 기본 타임존을 Asia/Seoul로 고정 */
    @PostConstruct
    public void initTimeZone() {
        log.info("before [TIMEZONE] Default JVM TimeZone: {}", TimeZone.getDefault().getID());
        log.info("before [TIMEZONE] ZonedDateTime Zone: {}", ZonedDateTime.now().getZone());

        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));

        log.info("[TIMEZONE] Default JVM TimeZone: {}", TimeZone.getDefault().getID());
        log.info("[TIMEZONE] ZonedDateTime Zone: {}", ZonedDateTime.now().getZone());
    }

    /** Feign 쿼리/경로 파라미터의 날짜/시간을 ISO-8601 형식으로 직렬화/파싱 */
    @Bean
    public FeignFormatterRegistrar feignIsoDateTimeFormatterRegistrar() {
        return registry -> {
            DateTimeFormatterRegistrar registrar = new DateTimeFormatterRegistrar();
            registrar.setUseIsoFormat(true); // LocalDate/LocalDateTime/ZonedDateTime/OffsetDateTime 등 ISO-8601 사용
            registrar.registerFormatters(registry);
        };
    }
}

