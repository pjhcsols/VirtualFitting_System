package com.basilium.redis.email.dto;

public record EmailRequestDto(
        String email,
        String code
) {
}
