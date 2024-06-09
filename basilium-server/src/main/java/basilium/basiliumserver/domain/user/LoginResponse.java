package basilium.basiliumserver.domain.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter@Setter
@RequiredArgsConstructor
public class LoginResponse {

    String token;
    String type;

}
