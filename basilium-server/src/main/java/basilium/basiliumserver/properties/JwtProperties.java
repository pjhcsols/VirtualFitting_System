package basilium.basiliumserver.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;


@ConfigurationProperties(prefix = "jwt")
public record JwtProperties (
    String secret,
    Long accessTokenValidity,
    Long refreshTokenValidity
){}
