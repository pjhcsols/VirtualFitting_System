package basilium.basiliumserver.domain.user.entity;


import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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

    /* 빠른 조회를 위한 룩업 맵 (불변) */
    private static final Map<String, Provider> BY_ENUM_NAME =
            Stream.of(values()).collect(Collectors.toUnmodifiableMap(
                    p -> p.name(), // "BRAND"
                    p -> p
            ));

    private static final Map<String, Provider> BY_PROVIDER_NAME =
            Stream.of(values()).collect(Collectors.toUnmodifiableMap(
                    p -> p.providerName, // "brand"
                    p -> p
            ));

    /**
     * 입력을 정규화해 Provider 로 변환한다.
     * - 우선 소문자 providerName("brand") 매칭
     * - 실패 시 대문자 enum 이름("BRAND") 매칭
     * - 둘 다 없으면 BasiliumCustomException(UNSUPPORTED_LOGIN_PROVIDER)
     */
    public static Provider from(String input) {
        return Optional.ofNullable(input)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .flatMap(s -> {
                    String lower = s.toLowerCase(Locale.ROOT);
                    Provider byProvider = BY_PROVIDER_NAME.get(lower);
                    if (byProvider != null) return Optional.of(byProvider);

                    String upper = s.toUpperCase(Locale.ROOT);
                    Provider byEnum = BY_ENUM_NAME.get(upper);
                    return Optional.ofNullable(byEnum);
                })
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.UNSUPPORTED_LOGIN_PROVIDER,
                        "지원하지 않는 로그인 방식입니다: " + input
                ));
    }

    /** 지원 여부만 빠르게 확인하고 싶을 때 */
    /*
    public static boolean isSupported(String input) {
        if (input == null) return false;
        String trimmed = input.trim();
        if (trimmed.isEmpty()) return false;
        return BY_PROVIDER_NAME.containsKey(trimmed.toLowerCase(Locale.ROOT))
                || BY_ENUM_NAME.containsKey(trimmed.toUpperCase(Locale.ROOT));
    }

     */


}
