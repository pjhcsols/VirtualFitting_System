package basilium.basiliumserver.domain.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {

    private String type;
    private String accessToken;
    private String refreshToken;

    // 기본 생성자
    public LoginResponse() {
    }

    // 직접 생성자 정의
    public LoginResponse(String type, String accessToken, String refreshToken) {
        this.type = type;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
