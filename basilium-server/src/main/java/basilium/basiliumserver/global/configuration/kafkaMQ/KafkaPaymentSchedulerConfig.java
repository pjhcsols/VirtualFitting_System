package basilium.basiliumserver.global.configuration.kafkaMQ;

import basilium.basiliumserver.properties.KafkaPaymentReservationProperties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ScheduledThreadPoolExecutor;

//재고 예약 배치용
@Configuration
@EnableConfigurationProperties(KafkaPaymentReservationProperties.class)
public class KafkaPaymentSchedulerConfig {

    @Bean(name = "paymentReservationScheduler", destroyMethod = "shutdownNow")
    @ConditionalOnMissingBean(name = "paymentReservationScheduler")
    public ScheduledThreadPoolExecutor paymentReservationScheduler(KafkaPaymentReservationProperties props) {
        var baseFactory = java.util.concurrent.Executors.defaultThreadFactory();

        ScheduledThreadPoolExecutor exec = new ScheduledThreadPoolExecutor(props.getPoolSize(), r -> {
            Thread t = baseFactory.newThread(r);
            //Thread t = new Thread(r);
            t.setName("payment-reservation-" + t.getId());
            t.setUncaughtExceptionHandler((th, ex) ->
                    org.slf4j.LoggerFactory.getLogger("payment-reservation")
                            .error("[uncaught] thread={}, ex={}", th.getName(), ex.toString(), ex));
            return t;
        });
        exec.setRemoveOnCancelPolicy(true); // 취소 즉시 큐에서 제거
        return exec; // 항상 non-null
    }
}
