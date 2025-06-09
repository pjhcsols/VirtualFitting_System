package com.basilium.redis.product.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@NoArgsConstructor
@RedisHash(value = "product")
public class RedisProduct {
    @Id
    private Long id;

    @Indexed
    private Long brandUserId;

    private String productName;

    private String productDesc;

    private Long productPrice;

    private List<Material> productMaterial = new ArrayList<>();

    private Color color;

    private Category category;

    private List<String> mainPhotoUrls = new ArrayList<>();

    private List<String> subPhotoUrls = new ArrayList<>();

    private Set<Size> productSizeTable = new HashSet<>();

    public RedisProduct(
            Long brandUserId,
            String productName,
            String productDesc,
            Long productPrice,
            List<Material> productMaterial,
            Color color,
            Category category,
            List<String> mainPhotoUrls,
            List<String> subPhotoUrls,
            Set<Size> productSizeTable
    ) {
        this.brandUserId = brandUserId;
        this.productName = productName;
        this.productDesc = productDesc;
        this.productPrice = productPrice;
        this.productMaterial = productMaterial;
        this.color = color;
        this.category = category;
        this.mainPhotoUrls = mainPhotoUrls;
        this.subPhotoUrls = subPhotoUrls;
        this.productSizeTable = productSizeTable;
    }
}
