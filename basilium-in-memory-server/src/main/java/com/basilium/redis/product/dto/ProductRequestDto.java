package com.basilium.redis.product.dto;

import com.basilium.redis.product.domain.*;

import java.util.List;
import java.util.Set;

public record ProductRequestDto(
        Long brandUserId,
        String productName,
        String productDesc,
        Long productPrice,
        List<Material> material,
        Color color,
        Category category,
        List<String> mainPhotoUrls,
        List<String> subPhotoUrls,
        Set<Size> productSizeTable
) {
    public static RedisProduct from(ProductRequestDto productRequestDto) {
        return new RedisProduct(
                productRequestDto.brandUserId(),
                productRequestDto.productName(),
                productRequestDto.productDesc(),
                productRequestDto.productPrice(),
                productRequestDto.material(),
                productRequestDto.color(),
                productRequestDto.category(),
                productRequestDto.mainPhotoUrls(),
                productRequestDto.subPhotoUrls(),
                productRequestDto.productSizeTable()
        );
    }
}
