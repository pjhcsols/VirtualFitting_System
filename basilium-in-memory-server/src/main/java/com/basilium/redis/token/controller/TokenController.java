package com.basilium.redis.token.controller;

import com.basilium.redis.token.dto.RequestTokenDto;
import com.basilium.redis.token.exception.NoBrandUserException;
import com.basilium.redis.token.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/redis/token")
@RequiredArgsConstructor
public class TokenController implements TokenApiDocs{
    private final TokenService tokenService;

    @Override
    @GetMapping("")
    public ResponseEntity<?> getTokenByBrandUser(@RequestParam("branduser") String brandUserId) {
        try{
            return ResponseEntity.ok().body(tokenService.getTokenByBrandUser(brandUserId));
        }catch(NoBrandUserException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @Override
    @PostMapping("")
    public ResponseEntity<?> saveToken(@RequestBody RequestTokenDto requestTokenDto) {
        tokenService.saveToken(requestTokenDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
