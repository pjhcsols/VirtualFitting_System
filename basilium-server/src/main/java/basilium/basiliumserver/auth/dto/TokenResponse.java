package basilium.basiliumserver.auth.dto;

public record TokenResponse(
        String accessToken,
        String refreshToken
) {

}