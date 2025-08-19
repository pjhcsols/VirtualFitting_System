package basilium.basiliumserver.domain.discount.service;

import basilium.basiliumserver.domain.discount.dto.*;
import basilium.basiliumserver.domain.discount.entity.ProductDiscount;
import basilium.basiliumserver.domain.discount.entity.UserDiscount;
import basilium.basiliumserver.domain.discount.repository.ProductDiscountRepository;
import basilium.basiliumserver.domain.discount.repository.UserDiscountRepository;
import basilium.basiliumserver.domain.product.entity.Product;
import basilium.basiliumserver.domain.product.entity.ProductStatus;
import basilium.basiliumserver.domain.product.repository.ProductRepository;

import basilium.basiliumserver.domain.user.entity.BrandUser;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import basilium.basiliumserver.domain.user.repository.BrandUserRepository;
import basilium.basiliumserver.domain.user.repository.NormalUserRepository;
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
public class DiscountService {

    private final ProductDiscountRepository productDiscountRepo;
    private final UserDiscountRepository userDiscountRepo;
    private final ProductRepository productRepo;
    private final BrandUserRepository brandUserRepo;
    private final NormalUserRepository normalUserRepo;

    /* ======================================================
       공용 계산/유틸
       ====================================================== */
    private static long nvl(Long v) { return v == null ? 0L : v; }

    private static long calcAmount(long base, int percent) {
        if (base <= 0 || percent <= 0) return 0L;
        return BigDecimal.valueOf(base)
                .multiply(BigDecimal.valueOf(percent).divide(BigDecimal.valueOf(100)))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();
    }

    private static long applyPercent(long base, int percent) {
        return Math.max(0, base - calcAmount(base, percent));
    }

    private BrandUser findBrandOrThrow(String brandUserId) {
        return brandUserRepo.findById(brandUserId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.MEMBER_NOT_FOUND, "브랜드 유저가 아닙니다."));
    }

    private Product findProductOrThrow(Long productId) {
        return productRepo.findById(productId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "상품이 없습니다: " + productId));
    }

    private void assertMyProduct(BrandUser me, Product p) {
        if (!p.getBrandUser().getUserNumber().equals(me.getUserNumber())) {
            throw new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "본인 상품만 설정할 수 있습니다.");
        }
    }

    private boolean isPubliclyVisible(Product p) {
        return p.getStatus() == ProductStatus.ON_SALE;
    }

    /* ======================================================
       0) 가격 견적(충돌 방지: 금액만 별도 제공)
       - ProductDiscount: 결제 기준가
       - UserDiscount: 뷰/표시용 추가 인하
       ====================================================== */
    public PriceQuoteDTO quote(Long productId, String maybeUserId) {
        Product p = findProductOrThrow(productId);
        long base = nvl(p.getProductPrice());
        String brandName = p.getBrandUser() != null ? p.getBrandUser().getFirmName() : "";

        LocalDateTime now = LocalDateTime.now();

        // 상품 할인(최대 퍼센트 1개 적용)
        int productPercent = productDiscountRepo.findActivePercentNow(productId, now).orElse(0);
        long productAmount = calcAmount(base, productPercent);
        long discounted = base - productAmount;

        Integer userExtraPercent = null;
        Long userExtraAmount = null;
        long finalUnit = discounted;

        if (maybeUserId != null && !maybeUserId.isBlank()) {
            NormalUser u = normalUserRepo.findById(maybeUserId).orElse(null);
            if (u != null) {
                Long userNumber = u.getUserNumber();
                Long brandUserNumber = p.getBrandUser() != null ? p.getBrandUser().getUserNumber() : null;

                Optional<UserDiscount> prioProduct = userDiscountRepo
                        .findActiveByUserAndProduct(userNumber, productId, now).stream().findFirst();

                Optional<UserDiscount> prioBrand = (brandUserNumber == null) ? Optional.empty()
                        : userDiscountRepo.findActiveByUserAndBrand(userNumber, brandUserNumber, now).stream().findFirst();

                Optional<UserDiscount> eff = prioProduct.isPresent() ? prioProduct : prioBrand;

                if (eff.isPresent()) {
                    int add = Math.max(0, Math.min(90, eff.get().getExtraPercent()));
                    long after = applyPercent(discounted, add);
                    userExtraPercent = add;
                    userExtraAmount = discounted - after;
                    finalUnit = after;
                }
            }
        }

        return PriceQuoteDTO.builder()
                .productId(productId)
                .brandName(brandName)
                .baseUnitPrice(base)
                .productDiscountPercent(productPercent)
                .productDiscountAmount(productAmount)
                .productDiscountedUnitPrice(discounted)
                .userExtraPercent(userExtraPercent)
                .userExtraDiscountAmount(userExtraAmount)
                .finalUnitPrice(finalUnit)
                .build();
    }

    /* ======================================================
       1) ProductDiscount (브랜드 전용 CRUD/조회) — 기존 로직 이관
       ====================================================== */

    public int getActivePercentNow(Long productId) {
        return productDiscountRepo.findActivePercentNow(productId, LocalDateTime.now()).orElse(0);
    }

    public Page<ProductDiscountDtos.ProductDiscountResponse> listMyDiscounts(
            String brandUserId, Long productId, Pageable pageable
    ) {
        BrandUser me = findBrandOrThrow(brandUserId);
        Page<ProductDiscount> page = (productId == null)
                ? productDiscountRepo.findAllByBrand(me.getUserNumber(), pageable)
                : productDiscountRepo.findAllByBrandAndProduct(me.getUserNumber(), productId, pageable);
        return page.map(this::toRespSnapshot);
    }

    public Page<ProductDiscountDtos.ActiveSummaryResponse> listMyActiveSummary(
            String brandUserId, Pageable pageable
    ) {
        BrandUser me = findBrandOrThrow(brandUserId);
        LocalDateTime now = LocalDateTime.now();

        List<ProductDiscountRepository.ActivePercentProjection> rows =
                Optional.ofNullable(productDiscountRepo.findActivePercentsOfBrand(me.getUserNumber(), now))
                        .orElseGet(List::of);

        int total = rows.size();
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), total);
        if (start >= end) return new PageImpl<>(List.of(), pageable, total);

        List<Long> pageIds = rows.subList(start, end).stream().map(ProductDiscountRepository.ActivePercentProjection::getProductId).toList();
        Map<Long, Integer> percentMap = rows.stream().collect(Collectors.toMap(
                ProductDiscountRepository.ActivePercentProjection::getProductId,
                ProductDiscountRepository.ActivePercentProjection::getPercent
        ));

        Map<Long, Product> productMap = productRepo.findAllById(pageIds).stream()
                .collect(Collectors.toMap(Product::getProductId, it -> it));

        List<ProductDiscountDtos.ActiveSummaryResponse> content = new ArrayList<>(pageIds.size());
        for (Long pid : pageIds) {
            Product p = productMap.get(pid);
            if (p == null) continue;
            long base = nvl(p.getProductPrice());
            int percent = Optional.ofNullable(percentMap.get(pid)).orElse(0);
            long amount = calcAmount(base, percent);
            long discounted = base - amount;
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

    @Transactional
    public ProductDiscountDtos.ProductDiscountResponse createProductDiscount(
            String brandUserId, ProductDiscountDtos.ProductDiscountRequest req
    ) {
        validateCreateUpdateParams(req.getPercent(), req.getAmount(), req.getStartAt(), req.getEndAt());

        BrandUser me = findBrandOrThrow(brandUserId);
        Product product = findProductOrThrow(req.getProductId());
        assertMyProduct(me, product);

        boolean active = req.getActive() == null || req.getActive();

        ProductDiscount pd = (req.getPercent() != null)
                ? ProductDiscount.createByPercent(me.getUserNumber(), product, req.getPercent(),
                req.getStartAt(), req.getEndAt(), active)
                : ProductDiscount.createByAmount(me.getUserNumber(), product, req.getAmount(),
                req.getStartAt(), req.getEndAt(), active);

        return toRespSnapshot(productDiscountRepo.save(pd));
    }

    @Transactional
    public ProductDiscountDtos.ProductDiscountResponse updateProductDiscount(
            String brandUserId, Long discountId, ProductDiscountDtos.ProductDiscountUpdateRequest req
    ) {
        ProductDiscount pd = productDiscountRepo.findById(discountId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "할인을 찾을 수 없습니다: " + discountId));
        BrandUser me = findBrandOrThrow(brandUserId);
        if (!pd.getBrandUserNumber().equals(me.getUserNumber())) {
            throw new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "본인 할인만 수정 가능");
        }

        validateUpdateCrossFields(req.getPercent(), req.getAmount(), req.getStartAt(), req.getEndAt());

        if (req.getPercent() != null) pd.changePercent(req.getPercent());
        if (req.getAmount() != null)  pd.changeAmount(req.getAmount());
        pd.changePeriod(req.getStartAt(), req.getEndAt());
        pd.changeActive(req.getActive());

        return toRespSnapshot(pd);
    }

    @Transactional
    public void setActiveProductDiscount(String brandUserId, Long discountId, boolean active) {
        ProductDiscount pd = productDiscountRepo.findById(discountId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "할인을 찾을 수 없습니다: " + discountId));
        BrandUser me = findBrandOrThrow(brandUserId);
        if (!pd.getBrandUserNumber().equals(me.getUserNumber())) {
            throw new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "본인 할인만 수정 가능");
        }
        pd.changeActive(active);
    }

    @Transactional
    public void deleteProductDiscount(String brandUserId, Long discountId) {
        ProductDiscount pd = productDiscountRepo.findById(discountId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "할인을 찾을 수 없습니다: " + discountId));
        BrandUser me = findBrandOrThrow(brandUserId);
        if (!pd.getBrandUserNumber().equals(me.getUserNumber())) {
            throw new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "본인 할인만 삭제 가능");
        }
        productDiscountRepo.delete(pd);
    }

    public ProductDiscountDtos.PublicPriceView getPublicPrice(Long productId) {
        Product p = findProductOrThrow(productId);
        if (!isPubliclyVisible(p)) throw new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "상품을 찾을 수 없습니다.");

        long base = nvl(p.getProductPrice());
        int percent = productDiscountRepo.findActivePercentNow(productId, LocalDateTime.now()).orElse(0);
        long amount = calcAmount(base, percent);
        long discounted = base - amount;

        return new ProductDiscountDtos.PublicPriceView(productId, base, percent, amount, discounted);
    }

    public List<ProductDiscountDtos.PublicPriceView> getPublicPrices(List<Long> ids) {
        if (ids == null || ids.isEmpty()) return List.of();

        Map<Long, Product> productMap = productRepo.findAllById(ids).stream()
                .filter(this::isPubliclyVisible)
                .collect(Collectors.toMap(Product::getProductId, it -> it));

        Map<Long, Integer> percentMap = productDiscountRepo
                .findActivePercentsByProductIds(ids, LocalDateTime.now()).stream()
                .collect(Collectors.toMap(ProductDiscountRepository.ActivePercentProjection::getProductId,
                        r -> Optional.ofNullable(r.getPercent()).orElse(0)));

        List<ProductDiscountDtos.PublicPriceView> out = new ArrayList<>(ids.size());
        for (Long id : ids) {
            Product p = productMap.get(id);
            if (p == null) continue;
            long base = nvl(p.getProductPrice());
            int percent = Optional.ofNullable(percentMap.get(id)).orElse(0);
            long amount = calcAmount(base, percent);
            long discounted = base - amount;
            out.add(new ProductDiscountDtos.PublicPriceView(id, base, percent, amount, discounted));
        }
        return out;
    }

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

    private void validateCreateUpdateParams(Integer percent, Long amount, LocalDateTime start, LocalDateTime end) {
        boolean bothNull = percent == null && amount == null;
        boolean bothSet  = percent != null && amount != null;
        if (bothNull || bothSet) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "percent 또는 amount 중 정확히 하나만 입력하세요.");
        validatePeriod(start, end);
        if (percent != null && (percent < 0 || percent > 90)) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "percent는 0~90 사이");
        if (amount != null && amount < 0) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "amount는 0 이상");
    }

    private void validateUpdateCrossFields(Integer percent, Long amount, LocalDateTime start, LocalDateTime end) {
        if (percent != null && amount != null) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "percent/amount 중 하나만 수정");
        if (start != null || end != null) {
            LocalDateTime s = start == null ? LocalDateTime.MIN : start;
            LocalDateTime e = end   == null ? LocalDateTime.MAX : end;
            if (!s.isBefore(e)) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "유효하지 않은 기간");
        }
    }

    private void validatePeriod(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null || !start.isBefore(end)) {
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "유효하지 않은 기간");
        }
    }

    /* ======================================================
       2) UserDiscount (브랜드 전용: 개인 추가할인)
       - 상품 스코프 > 브랜드 전상품 스코프
       ====================================================== */

    @Transactional
    public Long upsertUserDiscountForBrand(String authBrandUserId, CreateUserDiscountRequest req) {
        BrandUser me = findBrandOrThrow(authBrandUserId);
        if (req.getTargetUserNumber() == null || req.getExtraPercent() == null
                || req.getStartAt() == null || req.getEndAt() == null) {
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "필수 파라미터 누락");
        }
        if (!req.getStartAt().isBefore(req.getEndAt())) {
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "기간이 올바르지 않습니다.");
        }
        NormalUser target = normalUserRepo.findById(req.getTargetUserNumber())
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.MEMBER_NOT_FOUND, "대상 유저가 없습니다."));

        UserDiscount ud = UserDiscount.builder()
                .user(target)
                .brandUser(me)          // 브랜드 전상품
                .product(null)
                .extraPercent(Math.max(0, Math.min(90, req.getExtraPercent())))
                .active(true)
                .startAt(req.getStartAt())
                .endAt(req.getEndAt())
                .build();
        return userDiscountRepo.save(ud).getId();
    }

    @Transactional
    public Long upsertUserDiscountForProduct(String authBrandUserId, CreateUserDiscountRequest req) {
        BrandUser me = findBrandOrThrow(authBrandUserId);
        if (req.getTargetUserNumber() == null || req.getTargetProductId() == null
                || req.getExtraPercent() == null || req.getStartAt() == null || req.getEndAt() == null) {
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "필수 파라미터 누락");
        }
        if (!req.getStartAt().isBefore(req.getEndAt())) {
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "기간이 올바르지 않습니다.");
        }
        NormalUser target = normalUserRepo.findById(req.getTargetUserNumber())
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.MEMBER_NOT_FOUND, "대상 유저가 없습니다."));
        Product product = findProductOrThrow(req.getTargetProductId());
        assertMyProduct(me, product);

        UserDiscount ud = UserDiscount.builder()
                .user(target)
                .brandUser(null)        // 상품 스코프
                .product(product)
                .extraPercent(Math.max(0, Math.min(90, req.getExtraPercent())))
                .active(true)
                .startAt(req.getStartAt())
                .endAt(req.getEndAt())
                .build();
        return userDiscountRepo.save(ud).getId();
    }

    /* ===== UserDiscount 소유 검증/매핑 유틸 ===== */
    private void assertMyUserDiscount(BrandUser me, UserDiscount ud) {
        if (ud.getProduct() != null) {
            Long owner = ud.getProduct().getBrandUser().getUserNumber();
            if (!Objects.equals(owner, me.getUserNumber())) {
                throw new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "본인 상품 스코프만 조작 가능");
            }
            return;
        }
        if (ud.getBrandUser() != null) {
            Long owner = ud.getBrandUser().getUserNumber();
            if (!Objects.equals(owner, me.getUserNumber())) {
                throw new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "본인 브랜드 스코프만 조작 가능");
            }
            return;
        }
        throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "잘못된 스코프입니다.");
    }

    /* ===== UserDiscount: 목록 ===== */
    public Page<UserDiscountDtos.UserDiscountResponse> listMyUserDiscounts(
            String authBrandUserId,
            Long targetUserNumber,
            Long productId,
            Boolean onlyActiveNow,
            Pageable pageable
    ) {
        BrandUser me = findBrandOrThrow(authBrandUserId);
        Page<UserDiscount> page = userDiscountRepo.findOwnedByBrand(
                me.getUserNumber(),
                targetUserNumber,
                productId,
                Boolean.TRUE.equals(onlyActiveNow),
                LocalDateTime.now(),
                pageable
        );
        return page.map(this::toUserDiscountResp);
    }
    private UserDiscountDtos.UserDiscountResponse toUserDiscountResp(UserDiscount ud) {
        return UserDiscountDtos.UserDiscountResponse.builder()
                .id(ud.getId())
                .userNumber(ud.getUser().getUserNumber())
                .brandUserNumber(ud.getBrandUser() != null ? ud.getBrandUser().getUserNumber() : null)
                .productId(ud.getProduct() != null ? ud.getProduct().getProductId() : null)
                .extraPercent(ud.getExtraPercent())
                .active(ud.getActive())
                .startAt(ud.getStartAt())
                .endAt(ud.getEndAt())
                .createdAt(ud.getCreatedAt())
                .build();
    }

    /* ===== UserDiscount: 부분 수정 ===== */
    @Transactional
    public UserDiscountDtos.UserDiscountResponse updateUserDiscount(
            String authBrandUserId, Long discountId, UpdateUserDiscountRequest req
    ) {
        BrandUser me = findBrandOrThrow(authBrandUserId);
        UserDiscount ud = Optional.ofNullable(userDiscountRepo.findOneWithJoins(discountId))
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "할인을 찾을 수 없습니다: " + discountId));
        assertMyUserDiscount(me, ud);

        if (req.getExtraPercent() != null) {
            int p = Math.max(0, Math.min(90, req.getExtraPercent()));
            ud.setExtraPercent(p);
        }
        if (req.getStartAt() != null || req.getEndAt() != null) {
            LocalDateTime s = req.getStartAt() != null ? req.getStartAt() : ud.getStartAt();
            LocalDateTime e = req.getEndAt()   != null ? req.getEndAt()   : ud.getEndAt();
            if (!s.isBefore(e)) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "유효하지 않은 기간");
            ud.changePeriod(req.getStartAt(), req.getEndAt());
        }
        ud.changeActive(req.getActive());
        return toUserDiscountResp(ud);
    }

    /* ===== UserDiscount: 활성 토글 ===== */
    @Transactional
    public void setActiveUserDiscount(String authBrandUserId, Long discountId, boolean active) {
        BrandUser me = findBrandOrThrow(authBrandUserId);
        UserDiscount ud = Optional.ofNullable(userDiscountRepo.findOneWithJoins(discountId))
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "할인을 찾을 수 없습니다: " + discountId));
        assertMyUserDiscount(me, ud);
        ud.changeActive(active);
    }

    /* ===== UserDiscount: 삭제 ===== */
    @Transactional
    public void deleteUserDiscount(String authBrandUserId, Long discountId) {
        BrandUser me = findBrandOrThrow(authBrandUserId);
        UserDiscount ud = Optional.ofNullable(userDiscountRepo.findOneWithJoins(discountId))
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "할인을 찾을 수 없습니다: " + discountId));
        assertMyUserDiscount(me, ud);
        userDiscountRepo.delete(ud);
    }


}