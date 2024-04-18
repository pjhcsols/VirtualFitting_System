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
public class NaverLoginResponse {

    private String resultCode;
    private String message;
    private Response response;

    @Getter
    public static class Response {
        
        private String nickname;
        private String name;
        private String email;
    }

}
