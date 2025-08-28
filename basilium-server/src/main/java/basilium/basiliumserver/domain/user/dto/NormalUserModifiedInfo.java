// src/main/java/basilium/basiliumserver/domain/user/dto/NormalUserModifiedInfo.java
package basilium.basiliumserver.domain.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Optional;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_ABSENT) // Optional.empty()는 직렬화 제외
public class NormalUserModifiedInfo {

    // 브랜드 규격과 동일
    public static final String LOGIN_ALLOWED = "^[A-Za-z0-9]{6,20}$";
    public static final String PW_SPECIAL    = ".*[!@#$%^&*()\\-_=+\\[\\]{}|;:'\",.<>/?].*";
    public static final String PHONE_E164    = "^\\+[1-9]\\d{7,14}$";

    private Optional<
            @Pattern(regexp = LOGIN_ALLOWED, message = "아이디는 영문/숫자만 사용, 6~20자입니다.")
                    String
            > id = Optional.empty();

    private Optional<
            @Size(min = 8, max = 16, message = "비밀번호는 8~16자여야 합니다.")
            @Pattern(regexp = ".*[A-Z].*", message = "비밀번호에 대문자를 포함하세요.")
            @Pattern(regexp = ".*[a-z].*", message = "비밀번호에 소문자를 포함하세요.")
            @Pattern(regexp = ".*\\d.*",  message = "비밀번호에 숫자를 포함하세요.")
            @Pattern(regexp = PW_SPECIAL, message = "비밀번호에 특수문자를 포함하세요.")
                    String
            > password = Optional.empty(); // 평문(서비스에서 해시 교체)

    private Optional<
            @Email
                    String
            > emailAddress = Optional.empty();

    private Optional<
            @Pattern(regexp = PHONE_E164, message = "전화번호는 +E.164 형식만 허용됩니다. 예: +821012344563")
                    String
            > phoneNumber = Optional.empty();

    private Optional<String>        name      = Optional.empty();
    private Optional<String>        nickname  = Optional.empty();
    private Optional<LocalDateTime> birthDate = Optional.empty();
    private Optional<String>        address   = Optional.empty();

    private Optional<Long> totalLength      = Optional.empty();
    private Optional<Long> chest            = Optional.empty();
    private Optional<Long> shoulder         = Optional.empty();
    private Optional<Long> arm              = Optional.empty();
    private Optional<Long> pantsTotalLength = Optional.empty();
    private Optional<Long> waistWidth       = Optional.empty();
    private Optional<Long> hipWidth         = Optional.empty();
    private Optional<Long> thighWidth       = Optional.empty();
    private Optional<Long> rise             = Optional.empty();
    private Optional<Long> hemWidth         = Optional.empty();

    private Optional<Integer> height = Optional.empty();
    private Optional<Integer> weight = Optional.empty();
}
