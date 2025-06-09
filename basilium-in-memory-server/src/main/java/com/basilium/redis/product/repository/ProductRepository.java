package com.basilium.redis.product.repository;

import com.basilium.redis.product.domain.RedisProduct;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends CrudRepository<RedisProduct, Long> {
    Optional<RedisProduct> findById(Long id);
    List<RedisProduct> findAllByBrandUserId(Long brandUserId);
}
