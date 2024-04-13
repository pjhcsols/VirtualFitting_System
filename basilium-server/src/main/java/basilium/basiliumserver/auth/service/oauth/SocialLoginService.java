package basilium.basiliumserver.auth.service.oauth;


import basilium.basiliumserver.auth.dto.SocialAuthResponse;
import basilium.basiliumserver.auth.dto.SocialUserResponse;
import basilium.basiliumserver.auth.entity.Provider;
import org.springframework.stereotype.Service;

@Service
public interface SocialLoginService {

    Provider getServiceName();

    SocialAuthResponse getAccessToken(String authorizationCode);

    SocialUserResponse getUserInfo(String accessToken);
}
