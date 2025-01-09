package basilium.basiliumserver.domain.user.dto;

public class RefreshTokenResponse {
    private String userId;
    private String accessToken;

    public RefreshTokenResponse() {
    }

    // 모든 필드를 포함한 생성자
    public RefreshTokenResponse(String userId, String accessToken) {
        this.userId = userId;
        this.accessToken = accessToken;
    }


    public String getUserId() {
        return userId;
    }

    public String getAccessToken() {
        return accessToken;
    }

}
