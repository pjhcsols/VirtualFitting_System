package com.basilium.redis.token.dto;

import com.basilium.redis.token.domain.Token;

public record RequestTokenDto(
        String brandUserId,
        String refreshToken
) {
    public static Token of(RequestTokenDto requestTokenDto) {
        return new Token(requestTokenDto.brandUserId(),requestTokenDto.refreshToken());
    }
}
