package basilium.basiliumserver.global.cache;

import basilium.basiliumserver.domain.discount.repository.ProductDiscountRepository;
import basilium.basiliumserver.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CachedCatalogReader {

    private final ProductRepository productRepo;
    private final ProductDiscountRepository productDiscountRepo;
    private final CacheManager cacheManager;

    private static final String CACHE_PRODUCT_BASIC = "product.basic";
    private static final String CACHE_DISCOUNT_PERCENT = "discount.activePercent";

    /** ProductRepository.BasicProjection 값을 안전하게 캐시할 불변 뷰 */
    public static class BasicView implements ProductRepository.BasicProjection {
        private final Long productId;
        private final String productName;
        private final Long productPrice;
        private final Long totalQuantity;
        private final Long brandUserNumber;
        private final String brandFirmName;

        public BasicView(ProductRepository.BasicProjection p) {
            this.productId = p.getProductId();
            this.productName = p.getProductName();
            this.productPrice = p.getProductPrice();
            this.totalQuantity = p.getTotalQuantity();
            this.brandUserNumber = p.getBrandUserNumber();
            this.brandFirmName = p.getBrandFirmName();
        }

        @Override public Long getProductId() { return productId; }
        @Override public String getProductName() { return productName; }
        @Override public Long getProductPrice() { return productPrice; }
        @Override public Long getTotalQuantity() { return totalQuantity; }
        @Override public Long getBrandUserNumber() { return brandUserNumber; }
        @Override public String getBrandFirmName() { return brandFirmName; }
    }

    /** 제품 기본 정보: per-id 캐시, 미스만 배치 조회 */
    public Map<Long, ProductRepository.BasicProjection> getBasicsByIdsCached(List<Long> productIds) {
        if (productIds == null || productIds.isEmpty()) return Map.of();

        Cache c = Objects.requireNonNull(cacheManager.getCache(CACHE_PRODUCT_BASIC));
        Set<Long> distinct = new LinkedHashSet<>(productIds);
        Map<Long, ProductRepository.BasicProjection> hit = new HashMap<>();

        List<Long> miss = new ArrayList<>();
        for (Long id : distinct) {
            ProductRepository.BasicProjection v = c.get(id, ProductRepository.BasicProjection.class);
            if (v != null) hit.put(id, v);
            else miss.add(id);
        }

        if (!miss.isEmpty()) {
            Map<Long, ProductRepository.BasicProjection> fetched = productRepo.findBasicsByIds(miss).stream()
                    .collect(Collectors.toMap(ProductRepository.BasicProjection::getProductId, BasicView::new)); // wrap to immutable view
            fetched.forEach((k, v) -> c.put(k, v));
            hit.putAll(fetched);
        }
        return hit;
    }

    /** 브랜드 할인 퍼센트: per-id & per-minute 캐시, 미스만 배치 조회 */
    public Map<Long, Integer> getActivePercentsByProductIdsCached(List<Long> productIds, LocalDateTime now) {
        if (productIds == null || productIds.isEmpty()) return Map.of();

        LocalDateTime minuteKey = now == null ? LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES)
                : now.truncatedTo(ChronoUnit.MINUTES);

        Cache c = Objects.requireNonNull(cacheManager.getCache(CACHE_DISCOUNT_PERCENT));
        Set<Long> distinct = new LinkedHashSet<>(productIds);
        Map<Long, Integer> hit = new HashMap<>();
        List<Long> miss = new ArrayList<>();

        for (Long id : distinct) {
            String key = keyForPercent(id, minuteKey);
            Integer v = c.get(key, Integer.class);
            if (v != null) hit.put(id, v);
            else miss.add(id);
        }

        if (!miss.isEmpty()) {
            Map<Long, Integer> fetched = productDiscountRepo.findActivePercentsByProductIds(miss, minuteKey).stream()
                    .collect(Collectors.toMap(
                            ProductDiscountRepository.ActivePercentProjection::getProductId,
                            p -> Optional.ofNullable(p.getPercent()).orElse(0)
                    ));
            // fill negative path too (없는 상품 → 0)
            for (Long id : miss) {
                Integer val = fetched.getOrDefault(id, 0);
                c.put(keyForPercent(id, minuteKey), val);
                hit.put(id, val);
            }
        }
        return hit;
    }

    private static String keyForPercent(Long productId, LocalDateTime minuteKey) {
        return productId + "|" + minuteKey.toString();
    }
}
