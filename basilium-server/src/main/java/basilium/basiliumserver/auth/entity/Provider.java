package basilium.basiliumserver.auth.entity;


import basilium.basiliumserver.auth.exception.AuthException;
import basilium.basiliumserver.auth.exception.AuthExceptionType;
import java.util.Arrays;

public enum Provider {
    NORMAL("normal"),
    BRAND("brand"),
    SUPER("super"),
    GOOGLE("google"),
    KAKAO("kakao"),
    NAVER("naver");

    private final String providerName;

    Provider(String providerName) {
        this.providerName = providerName;
    }

    public static Provider from(String name) {
        return Arrays.stream(values())
                .filter(it -> it.providerName.equals(name))
                .findFirst()
                .orElseThrow(() -> new AuthException(AuthExceptionType.UNSUPPORTED_LOGIN_PROVIDER));
    }
}
