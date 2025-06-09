package com.basilium.redis.email.exception;

public class CodeMissMatchException extends RuntimeException {
    public CodeMissMatchException(String message) {
        super(message);
    }
}
