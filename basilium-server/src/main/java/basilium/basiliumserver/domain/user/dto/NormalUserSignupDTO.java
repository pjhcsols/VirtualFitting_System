// src/main/java/basilium/basiliumserver/domain/user/dto/NormalUserSignupDTO.java
package basilium.basiliumserver.domain.user.dto;

import basilium.basiliumserver.domain.user.entity.Gender;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NormalUserSignupDTO {

    public static final String LOGIN_ALLOWED = "^[A-Za-z0-9]{6,20}$";
    public static final String PW_SPECIAL    = ".*[!@#$%^&*()\\-_=+\\[\\]{}|;:'\",.<>/?].*";
    public static final String PHONE_E164    = "^\\+[1-9]\\d{7,14}$";

    @NotBlank
    @Pattern(regexp = LOGIN_ALLOWED, message = "아이디는 영문/숫자만 사용, 6~20자입니다.")
    private String id;

    @NotBlank
    @Size(min = 8, max = 16, message = "비밀번호는 8~16자여야 합니다.")
    @Pattern(regexp = ".*[A-Z].*", message = "비밀번호에 대문자를 포함하세요.")
    @Pattern(regexp = ".*[a-z].*", message = "비밀번호에 소문자를 포함하세요.")
    @Pattern(regexp = ".*\\d.*",  message = "비밀번호에 숫자를 포함하세요.")
    @Pattern(regexp = PW_SPECIAL, message = "비밀번호에 특수문자를 포함하세요.")
    private String password;

    @NotBlank @Email
    private String emailAddress;

    @NotBlank
    @Pattern(regexp = PHONE_E164, message = "전화번호는 +E.164 형식만 허용됩니다. 예: +821012344563")
    private String phoneNumber;

    @NotBlank private String name;
    @NotBlank private String nickname;
    @NotNull  private Gender gender;
    @NotNull  private LocalDateTime birthDate;
    @NotBlank private String address;

    // 선택 치수
    private Long totalLength;
    private Long chest;
    private Long shoulder;
    private Long arm;
    private Long pantsTotalLength;
    private Long waistWidth;
    private Long hipWidth;
    private Long thighWidth;
    private Long rise;
    private Long hemWidth;
    private Integer height;
    private Integer weight;
}
