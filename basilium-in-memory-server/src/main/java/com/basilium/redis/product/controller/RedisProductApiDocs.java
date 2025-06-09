package com.basilium.redis.product.controller;

import com.basilium.redis.product.dto.ProductRequestDto;
import org.springframework.http.ResponseEntity;

public interface RedisProductApiDocs {
    ResponseEntity<?> saveProduct(ProductRequestDto product);
    ResponseEntity<?> getProduct(String id);
    ResponseEntity<?> getProducts(String brandUserId);
}
