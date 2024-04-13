package basilium.basiliumserver.auth.controller.oauth;

import basilium.basiliumserver.auth.dto.SocialLoginRequest;
import basilium.basiliumserver.auth.dto.TokenResponse;
import basilium.basiliumserver.auth.entity.Provider;
import basilium.basiliumserver.auth.service.oauth.OAuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class OAuthController {

    private final OAuthService OAuthService;

    @PostMapping("/oauth/{provider}/login")
    public ResponseEntity<TokenResponse> doSocialLogin(
            @RequestBody SocialLoginRequest request,
            @PathVariable String provider
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(OAuthService.doSocialLogin(request, Provider.from(provider)));
    }
}
