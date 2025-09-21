// src/main/java/.../domain/user/dto/SuperUserDto.java
package basilium.basiliumserver.domain.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

public class SuperUserDto {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Signup {
        @NotBlank private String id;
        @NotBlank private String password;
        @Email @NotBlank private String emailAddress;
        @NotBlank private String phoneNumber;

        @NotBlank private String name;
        private String position;
        private String department;
        private String jobRole;

        @Builder.Default
        private List<String> bannerImageFileUrls = List.of(); // 가입 시 무시(업로드 API에서 저장)
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UpdateProfile {
        /**
         * PATCH: 전달된 필드만 갱신(= null/미전달은 유지)
         * 기존 엔티티의 주요 필드를 모두 포함
         */
        private String id;                 // 로그인 ID 변경 허용(중복검사 필요)
        private String password;           // 변경 시에만 해시 적용
        @Email private String emailAddress;
        private String phoneNumber;

        private String name;
        private String position;
        private String department;
        private String jobRole;
    }
}
