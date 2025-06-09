package com.basilium.redis.token.controller;

import com.basilium.redis.token.dto.RequestTokenDto;
import com.basilium.redis.token.exception.NoBrandUserException;
import com.basilium.redis.token.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/redis/token")
@RequiredArgsConstructor
public class TokenController implements TokenApiDocs{
    private final TokenService tokenService;

    @Override
    public ResponseEntity<?> getTokenByBrandUser(@RequestBody RequestTokenDto requestTokenDto) {
        try{
            return ResponseEntity.ok().body(tokenService.getTokenByBrandUser(requestTokenDto.brandUserId()));
        }catch(NoBrandUserException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public ResponseEntity<?> saveToken(RequestTokenDto requestTokenDto) {
        tokenService.saveToken(requestTokenDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
