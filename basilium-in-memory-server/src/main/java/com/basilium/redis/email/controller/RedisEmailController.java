package com.basilium.redis.email.controller;

import com.basilium.redis.email.dto.EmailRequestDto;
import com.basilium.redis.email.dto.EmailSendRequestDto;
import com.basilium.redis.email.exception.CodeMissMatchException;
import com.basilium.redis.email.exception.EmailNotSendException;
import com.basilium.redis.email.exception.EmailNotValidException;
import com.basilium.redis.email.service.EmailService;
import com.basilium.redis.email.service.RedisEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/redis/email")
@RequiredArgsConstructor
public class RedisEmailController implements RedisEmailApiDocs{
    private final RedisEmailService redisEmailService;
    private final EmailService emailService;

    @Override
    @PostMapping("")
    public ResponseEntity<?> sendEmail(@RequestBody EmailSendRequestDto emailSendRequestDto) {
        try{
            emailService.sendEmail(emailSendRequestDto.email());
            return ResponseEntity.ok().build();
        }catch(EmailNotSendException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody EmailRequestDto emailRequestDto) {
        try{
            redisEmailService.checkVerificationCode(emailRequestDto);
            return ResponseEntity.ok().build();
        }catch(CodeMissMatchException | EmailNotValidException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Override
    @PostMapping("/resend")
    public ResponseEntity<?> resendEmail(@RequestBody EmailSendRequestDto emailSendRequestDto) {
        try{
            emailService.sendEmailAgain(emailSendRequestDto.email());
            return ResponseEntity.ok().build();
        }catch(EmailNotSendException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
