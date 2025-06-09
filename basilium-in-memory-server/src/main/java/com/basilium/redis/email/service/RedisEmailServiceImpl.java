package com.basilium.redis.email.service;

import com.basilium.redis.email.domain.Email;
import com.basilium.redis.email.dto.EmailRequestDto;
import com.basilium.redis.email.exception.CodeMissMatchException;
import com.basilium.redis.email.exception.EmailNotValidException;
import com.basilium.redis.email.repository.EmailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RedisEmailServiceImpl implements RedisEmailService {
    private final EmailRepository emailRepository;

    @Override
    public boolean checkVerificationCode(EmailRequestDto emailRequestDto) {
        Optional<Email> email = emailRepository.findByEmail(emailRequestDto.email());
        if(email.isEmpty()){
            throw new EmailNotValidException("Email not found");
        }
        if(!email.get().getAuthCode().equals(emailRequestDto.code())){
             throw new CodeMissMatchException("Verify Code mismatch");
        }
        return true;
    }
}
