package basilium.basiliumserver.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KaKaoLoginResponse {

    private Long id;
    private KakaoAccount kakao_account;

    @Getter
    public static class KakaoAccount {

        private String email;
    }
}