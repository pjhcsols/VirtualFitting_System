package basilium.basiliumserver.domain.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.*;
import lombok.*;

public final class BrandUserDto {

    /** 공통 정규식 상수 */
    public static final class Regex {
        private Regex() {}
        /** 아이디: 영문/숫자만 허용 + 길이(6~20) */
        public static final String LOGIN_ALLOWED = "^[A-Za-z0-9]{6,20}$";
        /** 비밀번호: 특수문자 1개 이상 */
        public static final String PW_SPECIAL = ".*[!@#$%^&*()\\-_=+\\[\\]{}|;:'\",.<>/?].*";
        /** 전화번호: E.164 (+로 시작, 총 8~15자리) — 예: +821012344563 */
        public static final String PHONE_E164 = "^\\+[1-9]\\d{7,14}$";
    }

    /** 가입 DTO — DTO에서 한 번만 검증 */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Signup {

        @NotBlank
        @Pattern(regexp = Regex.LOGIN_ALLOWED,
                message = "아이디는 영문/숫자만 사용, 6~20자입니다.")
        private String id;

        @NotBlank
        @Size(min = 8, max = 16, message = "비밀번호는 8~16자여야 합니다.")
        @Pattern(regexp = ".*[A-Z].*", message = "비밀번호에 대문자를 포함하세요.")
        @Pattern(regexp = ".*[a-z].*", message = "비밀번호에 소문자를 포함하세요.")
        @Pattern(regexp = ".*\\d.*",  message = "비밀번호에 숫자를 포함하세요.")
        @Pattern(regexp = Regex.PW_SPECIAL, message = "비밀번호에 특수문자를 포함하세요.")
        private String password;

        @NotBlank @Email
        private String emailAddress;

        /** 전화번호는 E.164 형식만 허용(+821012344563) */
        @NotBlank
        @Pattern(regexp = Regex.PHONE_E164,
                message = "전화번호는 +E.164 형식만 허용됩니다. 예: +821012344563")
        private String phoneNumber;

        @NotBlank private String firmName;
        @NotBlank private String firmAddress;
        @NotBlank private String businessRegistration;

        @Size(max = 500) private String firmWebUrl;   // optional
        @NotBlank @Email private String firmEmail;
        @Pattern(regexp = Regex.PHONE_E164,
                message = "전화번호는 +E.164 형식만 허용됩니다. 예: +821012344563")
        @NotBlank private String firmPhone;
    }

    /** 수정 DTO — null이면 미변경 (서비스에서 Optional 체인으로 처리) */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Update {

        @Pattern(regexp = Regex.LOGIN_ALLOWED,
                message = "아이디는 영문/숫자만 사용, 6~20자입니다.")
        private String id;                // null = 미변경

        @Size(min = 8, max = 16, message = "비밀번호는 8~16자여야 합니다.")
        @Pattern(regexp = ".*[A-Z].*", message = "비밀번호에 대문자를 포함하세요.")
        @Pattern(regexp = ".*[a-z].*", message = "비밀번호에 소문자를 포함하세요.")
        @Pattern(regexp = ".*\\d.*",  message = "비밀번호에 숫자를 포함하세요.")
        @Pattern(regexp = Regex.PW_SPECIAL, message = "비밀번호에 특수문자를 포함하세요.")
        private String password;          // null = 미변경

        @Email
        private String emailAddress;      // null = 미변경

        /** 전화번호는 E.164 형식만 허용(+821012344563) */
        @Pattern(regexp = Regex.PHONE_E164,
                message = "전화번호는 +E.164 형식만 허용됩니다. 예: +821012344563")
        private String phoneNumber;       // null = 미변경

        private String firmName;          // null = 미변경
        private String firmAddress;       // null = 미변경
        private String businessRegistration;
        @Size(max = 500) private String firmWebUrl;
        @Email private String firmEmail;
        @Pattern(regexp = Regex.PHONE_E164,
                message = "전화번호는 +E.164 형식만 허용됩니다. 예: +821012344563")
        private String firmPhone;
    }

    private BrandUserDto() {}
}
