package basilium.basiliumserver.auth.service.oauth;


import basilium.basiliumserver.auth.controller.oauth.google.GoogleAuthApi;
import basilium.basiliumserver.auth.controller.oauth.google.GoogleUserApi;
import basilium.basiliumserver.auth.dto.GoogleLoginResponse;
import basilium.basiliumserver.auth.dto.GoogleRequestAccessTokenDto;
import basilium.basiliumserver.auth.dto.SocialAuthResponse;
import basilium.basiliumserver.auth.dto.SocialUserResponse;
import basilium.basiliumserver.auth.entity.Provider;
import basilium.basiliumserver.auth.util.GsonLocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class GoogleLoginServiceImpl implements SocialLoginService {

    private final GoogleAuthApi googleAuthApi;
    private final GoogleUserApi googleUserApi;

    @Value("${social.client.google.rest-api-key}")
    private String googleAppKey;
    @Value("${social.client.google.secret-key}")
    private String googleAppSecret;
    @Value("${social.client.google.redirect-uri}")
    private String googleRedirectUri;
    @Value("${social.client.google.grant_type}")
    private String googleGrantType;

    @Override
    public Provider getServiceName() {
        return Provider.GOOGLE;
    }

    @Override
    public SocialAuthResponse getAccessToken(String authorizationCode) {
        ResponseEntity<?> response = googleAuthApi.getAccessToken(
                GoogleRequestAccessTokenDto.builder()
                        .code(authorizationCode)
                        .client_id(googleAppKey)
                        .client_secret(googleAppSecret)
                        .redirect_uri(googleRedirectUri)
                        .grant_type(googleGrantType)
                        .build()
        );
        return new Gson()
                .fromJson(
                        response.getBody().toString(),
                        SocialAuthResponse.class
                );
    }

    @Override
    public SocialUserResponse getUserInfo(String accessToken) {
        ResponseEntity<?> response = googleUserApi.getUserInfo(accessToken);
        String jsonString = response.getBody().toString();
        Gson gson = new GsonBuilder()
                .setPrettyPrinting()
                .registerTypeAdapter(LocalDateTime.class, new GsonLocalDateTimeAdapter())
                .create();
        GoogleLoginResponse googleLoginResponse = gson.fromJson(jsonString, GoogleLoginResponse.class);
        return SocialUserResponse.builder()
                .userEmail(googleLoginResponse.getEmail())
                .userName(googleLoginResponse.getName())
                .build();
    }
}
