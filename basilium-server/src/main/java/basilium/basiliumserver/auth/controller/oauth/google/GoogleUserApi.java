package basilium.basiliumserver.auth.controller.oauth.google;


import basilium.basiliumserver.configuration.FeignConfiguration;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(value = "googleUser", url = "https://www.googleapis.com", configuration = {FeignConfiguration.class})
public interface GoogleUserApi {

    @GetMapping("/userinfo/v2/me")
    ResponseEntity<String> getUserInfo(@RequestParam("access_token") String accessToken);
}