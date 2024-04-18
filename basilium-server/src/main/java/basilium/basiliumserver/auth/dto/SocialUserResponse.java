package basilium.basiliumserver.auth.dto;

import lombok.Builder;

@Builder
public record SocialUserResponse(
        String userEmail,
        String userName,
        String userNickname
) {

}