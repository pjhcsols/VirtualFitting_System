package basilium.basiliumserver.auth.controller.oauth.kakao;

import basilium.basiliumserver.configuration.FeignConfiguration;
import java.util.Map;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(value = "kakaoUser", url = "https://kapi.kakao.com", configuration = {FeignConfiguration.class})
public interface KakaoUserApi {

    @GetMapping("/v2/user/me")
    ResponseEntity<String> getUserInfo(@RequestHeader Map<String, String> header);
}