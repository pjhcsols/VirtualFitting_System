package com.basilium.redis.email.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@RedisHash(value = "email")
public class Email {
    @Id
    private String email;

    @Setter
    private String authCode;

    @TimeToLive
    @Setter
    private Long timeToLive;
}
