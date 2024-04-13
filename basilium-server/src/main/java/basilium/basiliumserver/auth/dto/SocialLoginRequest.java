package basilium.basiliumserver.auth.dto;

import jakarta.validation.constraints.NotNull;

public record SocialLoginRequest(
        @NotNull
        String code
) {

}
