// src/main/java/basilium/basiliumserver/domain/user/dto/NormalUserSignupDTO.java
package basilium.basiliumserver.domain.user.dto;

import basilium.basiliumserver.domain.user.entity.Gender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class NormalUserSignupDTO {
    @NotBlank private String id;
    @NotBlank private String password;
    @NotBlank private String emailAddress;
    @NotBlank private String phoneNumber;
    @NotBlank private String name;
    @NotBlank private String nickname;
    @NotNull  private Gender gender;
    @NotNull  private LocalDateTime birthDate;
    @NotBlank private String address;

    // --- 선택 치수 ---
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
