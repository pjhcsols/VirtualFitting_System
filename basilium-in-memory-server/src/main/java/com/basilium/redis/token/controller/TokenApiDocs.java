package com.basilium.redis.token.controller;

import com.basilium.redis.token.dto.RequestTokenDto;
import org.springframework.http.ResponseEntity;

public interface TokenApiDocs {

    ResponseEntity<?> getTokenByBrandUser(String brandUserId);
    ResponseEntity<?> saveToken(RequestTokenDto requestTokenDto);
}
