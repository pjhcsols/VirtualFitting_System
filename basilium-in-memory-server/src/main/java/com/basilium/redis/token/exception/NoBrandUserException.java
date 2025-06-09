package com.basilium.redis.token.exception;

public class NoBrandUserException extends RuntimeException {
    public NoBrandUserException(String message) {
        super(message);
    }
}
