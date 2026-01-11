package basilium.basiliumserver.global.cache;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.concurrent.TimeUnit;

// NOTE: JPA 2nd-Level Cache는 미사용. 조회 캐시는 Spring Cache(Caffeine)만 사용합니다.
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        Caffeine<Object, Object> base = Caffeine.newBuilder()
                .expireAfterWrite(60, TimeUnit.SECONDS) // 요구사항: 30~60s 중 60s 선택
                .maximumSize(20_000);

        SimpleCacheManager mgr = new SimpleCacheManager();
        mgr.setCaches(List.of(
                new CaffeineCache("product.basic", base.build()),
                new CaffeineCache("discount.activePercent", base.build())
        ));
        return mgr;
    }
}