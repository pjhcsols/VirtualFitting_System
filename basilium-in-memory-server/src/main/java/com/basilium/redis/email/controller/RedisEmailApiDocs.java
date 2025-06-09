package com.basilium.redis.email.controller;

import com.basilium.redis.email.dto.EmailRequestDto;
import com.basilium.redis.email.dto.EmailSendRequestDto;
import org.springframework.http.ResponseEntity;

public interface RedisEmailApiDocs {
    ResponseEntity<?> sendEmail(EmailSendRequestDto emailSendRequestDto);

    ResponseEntity<?> verifyCode(EmailRequestDto emailRequestDto);

    ResponseEntity<?> resendEmail(EmailSendRequestDto emailSendRequestDto);
}
