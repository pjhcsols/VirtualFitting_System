package com.basilium.redis.product.service;

import com.basilium.redis.product.domain.RedisProduct;
import com.basilium.redis.product.dto.ProductRequestDto;

import java.util.List;

public interface ProductService {
    void save(ProductRequestDto product);
    RedisProduct getProduct(String productId);
    List<RedisProduct> getAllProducts(String brandUserId);
}
