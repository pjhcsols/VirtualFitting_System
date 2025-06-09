package com.basilium.redis.product.controller;

import com.basilium.redis.product.dto.ProductRequestDto;
import com.basilium.redis.product.exception.TemporalProductOverException;
import com.basilium.redis.product.service.RedisProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/redis/product")
@RequiredArgsConstructor
public class RedisProductController implements RedisProductApiDocs{
    private final RedisProductService redisProductService;

    @Override
    @PostMapping("")
    public ResponseEntity<?> saveProduct(@RequestBody ProductRequestDto product) {
        try{
            redisProductService.save(product);
            return new ResponseEntity<>(product, HttpStatus.CREATED);
        } catch (TemporalProductOverException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable String id) {
        return ResponseEntity.ok(redisProductService.getProduct(id));
    }

    @Override
    @GetMapping("/{brandUserId}/brandUser")
    public ResponseEntity<?> getProducts(@PathVariable String brandUserId) {
        return ResponseEntity.ok(redisProductService.getAllProducts(brandUserId));
    }
}
