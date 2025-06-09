package com.basilium.redis.email.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmailUtils {
    private final JavaMailSender mailSender;

    public void sendEmail(String email, int secureNumber) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setText(Integer.toString(secureNumber));
        mailSender.send(message);
    }
}
