package basilium.basiliumserver.auth.service.oauth;

import basilium.basiliumserver.auth.controller.oauth.kakao.KakaoAuthApi;
import basilium.basiliumserver.auth.controller.oauth.kakao.KakaoUserApi;
import basilium.basiliumserver.auth.dto.KaKaoLoginResponse;
import basilium.basiliumserver.auth.dto.KaKaoLoginResponse.KakaoAccount;
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

@Service
@Slf4j
@RequiredArgsConstructor
public class KakaoLoginServiceImpl implements SocialLoginService {

    private final KakaoAuthApi kakaoAuthApi;
    private final KakaoUserApi kakaoUserApi;

    @Value("${social.client.kakao.rest-api-key}")
    private String kakaoAppKey;
    @Value("${social.client.kakao.redirect-uri}")
    private String kakaoRedirectUri;
    @Value("${social.client.kakao.grant_type}")
    private String kakaoGrantType;

    @Override
    public Provider getServiceName() {
        return Provider.KAKAO;
    }

    @Override
    public SocialAuthResponse getAccessToken(String authorizationCode) {
        ResponseEntity<?> response = kakaoAuthApi.getAccessToken(
                authorizationCode,
                kakaoAppKey,
                kakaoRedirectUri,
                kakaoGrantType
        );
        return new Gson()
                .fromJson(
                        response.getBody().toString(),
                        SocialAuthResponse.class
                );
    }

    @Override
    public SocialUserResponse getUserInfo(String accessToken) {
        Map<String, String> headerMap = new HashMap<>();
        headerMap.put("authorization", "Bearer " + accessToken);
        ResponseEntity<?> response = kakaoUserApi.getUserInfo(headerMap);
        String jsonString = response.getBody().toString();
        Gson gson = new GsonBuilder()
                .setPrettyPrinting()
                .registerTypeAdapter(LocalDateTime.class, new GsonLocalDateTimeAdapter())
                .create();
        KaKaoLoginResponse kaKaoLoginResponse = gson.fromJson(jsonString, KaKaoLoginResponse.class);
        KakaoAccount kakao_account = kaKaoLoginResponse.getKakao_account();
        return SocialUserResponse.builder()
                .userEmail(kakao_account.getEmail())
                .build();
    }
}