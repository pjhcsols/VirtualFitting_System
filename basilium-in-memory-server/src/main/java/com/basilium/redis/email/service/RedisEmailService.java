package com.basilium.redis.email.service;


import com.basilium.redis.email.dto.EmailRequestDto;

public interface RedisEmailService {
    boolean checkVerificationCode(EmailRequestDto emailRequestDto);
}
