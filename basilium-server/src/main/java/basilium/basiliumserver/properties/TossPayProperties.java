package basilium.basiliumserver.properties;

import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@ConfigurationProperties(prefix = "toss.payments")
public class TossPayProperties {
    private final String secretKey;
    public TossPayProperties(String secretKey) { this.secretKey = secretKey; }
}
