package com.basilium.redis.product.service;

import com.basilium.redis.product.domain.RedisProduct;
import com.basilium.redis.product.dto.ProductRequestDto;
import com.basilium.redis.product.exception.TemporalProductOverException;
import com.basilium.redis.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RedisProductService implements ProductService{
    private final ProductRepository productRepository;

    @Override
    public void save(ProductRequestDto product) throws TemporalProductOverException {
        if(productRepository.findAllByBrandUserId(product.brandUserId()).size() >= 5){
            throw new TemporalProductOverException("BrandUser 는 최대 5개의 상품까지 임시저장이 가능합니다!");
        }
        productRepository.save(ProductRequestDto.from(product));
    }

    @Override
    public RedisProduct getProduct(String productId) {
        return productRepository.findById(Long.parseLong(productId)).orElse(null);
    }

    @Override
    public List<RedisProduct> getAllProducts(String brandUserId) {
        return productRepository.findAllByBrandUserId(Long.parseLong(brandUserId));
    }
}
