package basilium.basiliumserver.domain.user.entity;


import basilium.basiliumserver.global.auth.exception.AuthException;
import basilium.basiliumserver.global.auth.exception.AuthExceptionType;
import java.util.Arrays;

//Provider.BRAND.name() 대문자
//getProviderName() 소문자
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

    public String getProviderName() {
        return providerName;
    }

    public static Provider from(String name) {
        return Arrays.stream(values())
                .filter(it -> it.providerName.equals(name))
                .findFirst()
                .orElseThrow(() -> new AuthException(AuthExceptionType.UNSUPPORTED_LOGIN_PROVIDER));
    }
}
