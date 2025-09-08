package basilium.basiliumserver.properties;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

//재고 예약 배치용
@ConfigurationProperties(prefix = "kafka.payment.reservation")
@Validated
@Getter
@Setter
public class KafkaPaymentReservationProperties {

    @Min(1)
    private long ttlMinutes;

    @Min(1)
    private int poolSize;
}
