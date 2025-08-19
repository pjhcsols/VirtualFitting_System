package basilium.basiliumserver.global.configuration;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

import java.time.ZonedDateTime;
import java.util.TimeZone;

@Slf4j
@Configuration
public class KstTimeConfig {

    @PostConstruct
    public void init() {
        log.info("before [TIMEZONE] Default JVM TimeZone: {}", TimeZone.getDefault().getID());
        log.info("before [TIMEZONE] ZonedDateTime Zone: {}", ZonedDateTime.now().getZone());
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
        log.info("[TIMEZONE] Default JVM TimeZone: {}", TimeZone.getDefault().getID());
        log.info("[TIMEZONE] ZonedDateTime Zone: {}", ZonedDateTime.now().getZone());
    }
}

