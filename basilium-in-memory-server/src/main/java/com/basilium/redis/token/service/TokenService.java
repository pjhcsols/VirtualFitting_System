package com.basilium.redis.token.service;

import com.basilium.redis.token.dto.RequestTokenDto;

public interface TokenService {
    String getTokenByBrandUser(String brandUserId);
    void saveToken(RequestTokenDto requestTokenDto);
}
