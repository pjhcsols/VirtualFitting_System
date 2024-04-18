package basilium.basiliumserver.auth.service.oauth;


import basilium.basiliumserver.auth.controller.oauth.naver.NaverAuthApi;
import basilium.basiliumserver.auth.controller.oauth.naver.NaverUserApi;
import basilium.basiliumserver.auth.dto.NaverLoginResponse;
import basilium.basiliumserver.auth.dto.NaverLoginResponse.Response;
import basilium.basiliumserver.auth.dto.SocialAuthResponse;
import basilium.basiliumserver.auth.dto.SocialUserResponse;
import basilium.basiliumserver.auth.entity.Provider;
import basilium.basiliumserver.auth.util.GsonLocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NaverLoginServiceImpl implements SocialLoginService {

    private final NaverAuthApi naverAuthApi;
    private final NaverUserApi naverUserApi;

    @Value("${social.client.naver.rest-api-key}")
    private String naverAppKey;

    @Value("${social.client.naver.secret-key}")
    private String naverAppSecret;

    @Value("${social.client.naver.redirect-uri}")
    private String naverRedirectUri;

    @Value("${social.client.naver.grant_type}")
    private String naverGrantType;

    @Override
    public Provider getServiceName() {
        return Provider.NAVER;
    }

    @Override
    public SocialAuthResponse getAccessToken(String authorizationCode) {
        ResponseEntity<?> response = naverAuthApi.getAccessToken(
                naverGrantType,
                naverAppKey,
                naverAppSecret,
                authorizationCode,
                "state"
        );
        return new Gson()
                .fromJson(
                        String.valueOf(response.getBody())
                        , SocialAuthResponse.class
                );
    }

    @Override
    public SocialUserResponse getUserInfo(String accessToken) {
        Map<String, String> headerMap = new HashMap<>();
        headerMap.put("authorization", "Bearer " + accessToken);
        ResponseEntity<?> response = naverUserApi.getUserInfo(headerMap);
        String jsonString = response.getBody().toString();
        Gson gson = new GsonBuilder()
                .setPrettyPrinting()
                .registerTypeAdapter(LocalDateTime.class, new GsonLocalDateTimeAdapter())
                .create();
        NaverLoginResponse naverLoginResponse = gson.fromJson(jsonString, NaverLoginResponse.class);
        Response naverUserInfo = naverLoginResponse.getResponse();
        return SocialUserResponse.builder()
                .userEmail(naverUserInfo.getEmail())
                .userName(naverUserInfo.getName())
                .userNickname(naverUserInfo.getNickname())
                .build();
    }
}
