package com.basilium.redis.email.service;

import com.basilium.redis.email.domain.Email;
import com.basilium.redis.email.exception.EmailNotSendException;
import com.basilium.redis.email.repository.EmailRepository;
import com.basilium.redis.email.utils.EmailUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final EmailRepository emailRepository;
    private final EmailUtils emailUtils;

    @Value("${mail-random-value}")
    private String randomValue;

    @Override
    @Async
    @Transactional
    public void sendEmail(String email) {
        int secureNumber = generateRandomNumber();
        try{
            Email userEmail = new Email(email, Integer.toString(secureNumber), 180L);
            emailRepository.save(userEmail);
            emailUtils.sendEmail(email, secureNumber);
        }catch(MailException e){
            throw new EmailNotSendException("Email does not send");
        }
    }

    @Override
    @Async
    @Transactional
    public void sendEmailAgain(String email) {
        emailRepository.deleteById(email);
        int secureNumber = generateRandomNumber();
        try{
            Email userEmail = new Email(email, Integer.toString(secureNumber), 180L);
            emailRepository.save(userEmail);
            emailUtils.sendEmail(email, secureNumber);
        }catch(MailException e){
            throw new EmailNotSendException("Email does not send");
        }
    }

    private int generateRandomNumber() {
        byte[] randomBytes = randomValue.getBytes();
        SecureRandom secureRandom = new SecureRandom(randomBytes);
        return secureRandom.nextInt(900000) + 100000;
    }
}
