package basilium.basiliumserver.auth.controller.oauth.google;


import basilium.basiliumserver.auth.dto.GoogleRequestAccessTokenDto;
import basilium.basiliumserver.configuration.FeignConfiguration;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(value = "googleAuth", url = "https://oauth2.googleapis.com/", configuration = FeignConfiguration.class)
public interface GoogleAuthApi {

    @PostMapping("/token")
    ResponseEntity<String> getAccessToken(@RequestBody GoogleRequestAccessTokenDto requestDto);

}
