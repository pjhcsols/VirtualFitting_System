package basilium.basiliumserver.service.DTO.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

//회원가입,로그인
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class LoginRequest {
    private String userId;
    private String userPassword;
}
