package com.basilium.redis.token.service;

import com.basilium.redis.token.domain.Token;
import com.basilium.redis.token.dto.RequestTokenDto;
import com.basilium.redis.token.exception.NoBrandUserException;
import com.basilium.redis.token.repository.TokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RedisTokenService implements TokenService {
    private final TokenRepository tokenRepository;

    @Override
    public String getTokenByBrandUser(String brandUserId) throws NoBrandUserException {
        Optional<Token> token = tokenRepository.findById(brandUserId);
        if(token.isEmpty()){
            throw new NoBrandUserException(brandUserId + " 유저 이름을 발견하지 못하였습니다.");
        }
        return token.get().getRefreshToken();
    }

    @Override
    public void saveToken(RequestTokenDto requestTokenDto) {
        tokenRepository.save(RequestTokenDto.of(requestTokenDto));
    }
}
