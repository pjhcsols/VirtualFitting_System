package com.basilium.redis.email.service;

public interface EmailService {
    void sendEmail(String email);
    void sendEmailAgain(String email);
}
