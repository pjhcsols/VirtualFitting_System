package basilium.basiliumserver.auth.dto;

import lombok.Builder;

@Builder
public record GoogleRequestAccessTokenDto(
        String code,
        String client_id,
        String client_secret,
        String redirect_uri,
        String grant_type
) {

}
