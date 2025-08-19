// src/main/java/basilium/basiliumserver/domain/productDiscount/service/ProductDiscountService.java
package basilium.basiliumserver.domain.productDiscount.service;
/*

import basilium.basiliumserver.domain.product.entity.Product;
import basilium.basiliumserver.domain.product.entity.ProductStatus;
import basilium.basiliumserver.domain.product.repository.ProductRepository;
import basilium.basiliumserver.domain.Discount.dto.ProductDiscountDtos;
import basilium.basiliumserver.domain.Discount.entity.ProductDiscount;
import basilium.basiliumserver.domain.productDiscount.repository.ProductDiscountRepository;
import basilium.basiliumserver.domain.user.entity.BrandUser;
import basilium.basiliumserver.domain.user.repository.BrandUserRepository;
import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductDiscountService {

    private final ProductDiscountRepository discountRepo;
    private final ProductRepository productRepo;
    private final BrandUserRepository brandUserRepo;

    */
/* =========================
       공용 유틸 (현재 유효 % 조회)
       ========================= *//*

    public int getActivePercentNow(Long productId) {
        return discountRepo.findActivePercentNow(productId, LocalDateTime.now()).orElseGet(() -> 0);
    }

    */
/* =========================
       브랜드 전용 조회
       ========================= *//*

    public Page<ProductDiscountDtos.ProductDiscountResponse> listMyDiscounts(
            String brandUserId, Long productId, Pageable pageable
    ) {
        BrandUser me = findBrandUserOrThrow(brandUserId);
        Page<ProductDiscount> page = Optional.ofNullable(productId)
                .map(pid -> discountRepo.findAllByBrandAndProduct(me.getUserNumber(), pid, pageable))
                .orElseGet(() -> discountRepo.findAllByBrand(me.getUserNumber(), pageable));

        return page.map(this::toRespSnapshot);
    }

    */
/** 내 현재 유효 할인(상품별 최댓값 %) 전체조회 요약 — 수동 페이징 *//*

    public Page<ProductDiscountDtos.ActiveSummaryResponse> listMyActiveSummary(
            String brandUserId, Pageable pageable
    ) {
        BrandUser me = findBrandUserOrThrow(brandUserId);
        LocalDateTime now = LocalDateTime.now();

        List<ProductDiscountRepository.ActivePercentProjection> rows =
                Optional.ofNullable(discountRepo.findActivePercentsOfBrand(me.getUserNumber(), now))
                        .orElseGet(Collections::emptyList);

        int total = rows.size();
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), total);
        if (start >= end) {
            return new PageImpl<>(Collections.emptyList(), pageable, total);
        }

        List<Long> pageProductIds = rows.subList(start, end).stream()
                .map(ProductDiscountRepository.ActivePercentProjection::getProductId)
                .toList();

        Map<Long, Integer> percentMap = rows.stream().collect(Collectors.toMap(
                ProductDiscountRepository.ActivePercentProjection::getProductId,
                ProductDiscountRepository.ActivePercentProjection::getPercent
        ));

        List<Product> products = Optional.of(pageProductIds)
                .filter(list -> !list.isEmpty())
                .map(productRepo::findAllById)
                .orElseGet(Collections::emptyList);

        Map<Long, Product> productMap = products.stream()
                .collect(Collectors.toMap(Product::getProductId, it -> it));

        List<ProductDiscountDtos.ActiveSummaryResponse> content = new ArrayList<>(pageProductIds.size());
        for (Long pid : pageProductIds) {
            Product p = productMap.get(pid);
            if (p == null) continue;
            long base = nvl(p.getProductPrice());
            int percent = Optional.ofNullable(percentMap.get(pid)).orElseGet(() -> 0);
            long amount = calcAmount(base, percent);
            long discounted = Math.max(0L, base - amount);
            content.add(ProductDiscountDtos.ActiveSummaryResponse.builder()
                    .productId(pid)
                    .baseUnitPrice(base)
                    .percent(percent)
                    .discountAmount(amount)
                    .discountedUnitPrice(discounted)
                    .build());
        }
        return new PageImpl<>(content, pageable, total);
    }

    */
/* =========================
       브랜드 전용: 생성/수정/삭제/활성토글
       ========================= *//*

    @Transactional
    public ProductDiscountDtos.ProductDiscountResponse create(
            String brandUserId, ProductDiscountDtos.ProductDiscountRequest req
    ) {
        validateCreateUpdateParams(req.getPercent(), req.getAmount(), req.getStartAt(), req.getEndAt());

        BrandUser me = findBrandUserOrThrow(brandUserId);
        Product product = findProductOrThrow(req.getProductId());
        assertMyProduct(me, product);

        boolean active = Optional.ofNullable(req.getActive()).orElseGet(() -> true);

        ProductDiscount pd = Optional.ofNullable(req.getPercent())
                .<ProductDiscount>map(percent -> ProductDiscount.createByPercent(
                        me.getUserNumber(), product, percent, req.getStartAt(), req.getEndAt(), active))
                .orElseGet(() -> ProductDiscount.createByAmount(
                        me.getUserNumber(), product, req.getAmount(), req.getStartAt(), req.getEndAt(), active));

        return toRespSnapshot(discountRepo.save(pd));
    }

    @Transactional
    public ProductDiscountDtos.ProductDiscountResponse update(
            String brandUserId, Long discountId, ProductDiscountDtos.ProductDiscountUpdateRequest req
    ) {
        ProductDiscount pd = findDiscountOrThrow(discountId);
        BrandUser me = findBrandUserOrThrow(brandUserId);
        assertMyDiscount(me, pd);

        validateUpdateCrossFields(req.getPercent(), req.getAmount(), req.getStartAt(), req.getEndAt());

        Optional.ofNullable(req.getPercent()).ifPresent(pd::changePercent);
        Optional.ofNullable(req.getAmount()).ifPresent(pd::changeAmount);
        pd.changePeriod(req.getStartAt(), req.getEndAt());
        pd.changeActive(req.getActive());

        return toRespSnapshot(pd);
    }

    @Transactional
    public void setActive(String brandUserId, Long discountId, boolean active) {
        ProductDiscount pd = findDiscountOrThrow(discountId);
        BrandUser me = findBrandUserOrThrow(brandUserId);
        assertMyDiscount(me, pd);
        pd.changeActive(active);
    }

    @Transactional
    public void delete(String brandUserId, Long discountId) {
        ProductDiscount pd = findDiscountOrThrow(discountId);
        BrandUser me = findBrandUserOrThrow(brandUserId);
        assertMyDiscount(me, pd);
        discountRepo.delete(pd);
    }

    */
/* =========================
       일반 유저 공개 가격
       ========================= *//*

    public ProductDiscountDtos.PublicPriceView getPublicPrice(Long productId) {
        Product p = findPubliclyVisibleProductOrThrow(productId);

        long base = nvl(p.getProductPrice());
        int percent = discountRepo.findActivePercentNow(productId, LocalDateTime.now()).orElseGet(() -> 0);
        long amount = calcAmount(base, percent);
        long discounted = Math.max(0L, base - amount);

        return new ProductDiscountDtos.PublicPriceView(p.getProductId(), base, percent, amount, discounted);
    }

    public List<ProductDiscountDtos.PublicPriceView> getPublicPrices(List<Long> productIds) {
        return Optional.ofNullable(productIds)
                .filter(list -> !list.isEmpty())
                .map(ids -> {
                    List<Product> products = productRepo.findAllById(ids);
                    Map<Long, Product> productMap = products.stream()
                            .filter(this::isPubliclyVisible)
                            .collect(Collectors.toMap(Product::getProductId, it -> it));

                    Map<Long, Integer> percentMap = discountRepo
                            .findActivePercentsByProductIds(ids, LocalDateTime.now()).stream()
                            .collect(Collectors.toMap(
                                    ProductDiscountRepository.ActivePercentProjection::getProductId,
                                    p -> Optional.ofNullable(p.getPercent()).orElseGet(() -> 0)
                            ));

                    List<ProductDiscountDtos.PublicPriceView> result = new ArrayList<>(ids.size());
                    for (Long id : ids) {
                        Product p = productMap.get(id);
                        if (p == null) continue; // 비전시 상품 제외
                        long base = nvl(p.getProductPrice());
                        int percent = Optional.ofNullable(percentMap.get(id)).orElseGet(() -> 0);
                        long amount = calcAmount(base, percent);
                        long discounted = Math.max(0L, base - amount);
                        result.add(new ProductDiscountDtos.PublicPriceView(id, base, percent, amount, discounted));
                    }
                    return result;
                })
                .orElseGet(Collections::emptyList);
    }

    */
/* =========================
       내부 헬퍼
       ========================= *//*

    private ProductDiscountDtos.ProductDiscountResponse toRespSnapshot(ProductDiscount pd) {
        Product product = pd.getProduct();
        long base = nvl(product.getProductPrice());
        return ProductDiscountDtos.ProductDiscountResponse.builder()
                .id(pd.getId())
                .productId(product.getProductId())
                .brandUserNumber(pd.getBrandUserNumber())
                .baseUnitPrice(base)
                .percent(pd.getPercent())
                .discountAmount(pd.getDiscountAmount())
                .discountedUnitPrice(pd.getDiscountedUnitPrice())
                .active(pd.getActive())
                .startAt(pd.getStartAt())
                .endAt(pd.getEndAt())
                .createdAt(pd.getCreatedAt())
                .build();
    }

    private BrandUser findBrandUserOrThrow(String brandUserId) {
        return brandUserRepo.findById(brandUserId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.MEMBER_NOT_FOUND, "브랜드 유저가 아닙니다."));
    }

    private Product findProductOrThrow(Long productId) {
        return productRepo.findById(productId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "상품이 없습니다: " + productId));
    }

    private ProductDiscount findDiscountOrThrow(Long discountId) {
        return discountRepo.findById(discountId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "할인을 찾을 수 없습니다: " + discountId));
    }

    private void assertMyProduct(BrandUser me, Product product) {
        if (!product.getBrandUser().getUserNumber().equals(me.getUserNumber())) {
            throw new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "본인 상품에만 할인 설정 가능");
        }
    }

    private void assertMyDiscount(BrandUser me, ProductDiscount pd) {
        if (!pd.getBrandUserNumber().equals(me.getUserNumber())) {
            throw new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "본인 할인만 조작 가능");
        }
    }

    private Product findPubliclyVisibleProductOrThrow(Long productId) {
        Product p = findProductOrThrow(productId);
        if (!isPubliclyVisible(p)) {
            throw new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "상품을 찾을 수 없습니다.");
        }
        return p;
    }

    */
/** 공개 노출 기준: 전시중(ON_SALE)만 검사 — 브랜드 승인 필드 의존 제거(컴파일 호환성) *//*

    private boolean isPubliclyVisible(Product p) {
        return p.getStatus() == ProductStatus.ON_SALE;
    }

    private void validateCreateUpdateParams(Integer percent, Long amount, LocalDateTime start, LocalDateTime end) {
        boolean bothNull = percent == null && amount == null;
        boolean bothSet = percent != null && amount != null;
        if (bothNull || bothSet) {
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "percent 또는 amount 중 정확히 하나만 입력하세요.");
        }
        validatePeriod(start, end);
        if (percent != null && (percent < 0 || percent > 90)) {
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "percent는 0~90 사이여야 합니다.");
        }
        if (amount != null && amount < 0) {
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "amount는 0 이상이어야 합니다.");
        }
    }

    private void validateUpdateCrossFields(Integer percent, Long amount, LocalDateTime start, LocalDateTime end) {
        if (percent != null && amount != null) {
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "percent 또는 amount 중 하나만 수정하세요.");
        }
        if (start != null || end != null) {
            LocalDateTime s = Optional.ofNullable(start).orElse(LocalDateTime.MIN);
            LocalDateTime e = Optional.ofNullable(end).orElse(LocalDateTime.MAX);
            if (!s.isBefore(e)) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "유효하지 않은 기간입니다.");
        }
    }

    private void validatePeriod(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null || !start.isBefore(end)) {
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "유효하지 않은 기간입니다.");
        }
    }

    private static long calcAmount(long base, int percent) {
        if (base <= 0 || percent <= 0) return 0L;
        return BigDecimal.valueOf(base)
                .multiply(BigDecimal.valueOf(percent).divide(BigDecimal.valueOf(100)))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();
    }

    private static long nvl(Long v) { return Optional.ofNullable(v).orElseGet(() -> 0L); }
}
*/
