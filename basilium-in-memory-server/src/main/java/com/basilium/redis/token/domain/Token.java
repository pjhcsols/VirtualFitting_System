package com.basilium.redis.token.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@RedisHash(value = "brand_user_token")
public class Token {
    @Id
    private String brandUserId;

    private String refreshToken;
}
