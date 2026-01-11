// src/main/java/basilium/basiliumserver/domain/cart/service/CartService.java
package basilium.basiliumserver.domain.cart.service;

import basilium.basiliumserver.domain.cart.dto.CartDtos;
import basilium.basiliumserver.domain.cart.entity.Cart;
import basilium.basiliumserver.domain.cart.entity.CartItem;
import basilium.basiliumserver.domain.cart.repository.CartRepository;
import basilium.basiliumserver.domain.coupon.entity.BrandCouponScope;
import basilium.basiliumserver.domain.coupon.entity.NormalCouponWalletStatus;
import basilium.basiliumserver.domain.coupon.repository.NormalCouponWalletRepository;
import basilium.basiliumserver.domain.product.entity.*;
import basilium.basiliumserver.domain.product.repository.ProductOptionRepository;
import basilium.basiliumserver.domain.product.repository.ProductRepository;
import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import basilium.basiliumserver.global.cache.CachedCatalogReader;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.CannotAcquireLockException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.LockTimeoutException;
import jakarta.persistence.PessimisticLockException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartService {

    private final CartRepository cartRepo;

    private final ProductRepository productRepo;
    private final ProductOptionRepository productOptionRepo;
    private final NormalCouponWalletRepository couponWalletRepo;

    // ✔ 캐시된 카탈로그(가격/브랜드/할인 퍼센트 등)
    private final CachedCatalogReader catalog;

    @PersistenceContext
    private EntityManager em;

    /* ===== 내부: 카트 행 비관적 락 + 안전 생성 + 짧은 재시도(현재 트랜잭션 내에서 flush) ===== */

    private <T> T withCartLock(String userId, Function<LockedCart, T> body) {
        final int maxRetry = 2; // 총 3회 시도(0,1,2)
        int attempt = 0;
        while (true) {
            try {
                LockedCart locked = getOrCreateLocked(userId); // for-update 확보(필요 시 안전 생성)
                T out = body.apply(locked);                   // 비즈니스 처리
                em.flush();                                   // 조기 에러 감지(UNIQUE/락 등)
                return out;
            } catch (PessimisticLockException | LockTimeoutException | CannotAcquireLockException | DataIntegrityViolationException e) {
                if (attempt++ >= maxRetry) {
                    throw new BasiliumCustomException(
                            ErrorCode.CONFLICT,
                            "장바구니가 동시에 수정되고 있습니다. 잠시 후 다시 시도해주세요."
                    );
                }
                try { Thread.sleep(30L * attempt); } catch (InterruptedException ignored) {}
            }
        }
    }

    private LockedCart getOrCreateLocked(String userId) {
        // 1) for-update 우선 획득
        var found = cartRepo.findWithItemsByUserIdForUpdate(userId);
        if (found.isPresent()) return new LockedCart(found.get(), false);

        // 2) 없으면 안전 생성(유니크 충돌 흡수)
        boolean createdNow = false;
        try {
            cartRepo.save(Cart.createFor(userId));
            createdNow = true;
        } catch (DataIntegrityViolationException ignoreDup) {
            // 동시 생성 경합 → 무시 후 재조회
        }

        // 3) 최종 for-update 재조회
        Cart locked = cartRepo.findWithItemsByUserIdForUpdate(userId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "Cart not found after create"));
        return new LockedCart(locked, createdNow);
    }

    private record LockedCart(Cart cart, boolean created) {}

    /* ===== 유틸 ===== */

    private static long roundPercent(long base, int percent) {
        if (base <= 0 || percent <= 0) return 0L;
        return BigDecimal.valueOf(base)
                .multiply(BigDecimal.valueOf(percent).divide(BigDecimal.valueOf(100)))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();
    }

    private static Size parseSize(String v) {
        try { return Size.valueOf(Objects.requireNonNull(v)); }
        catch (Exception e) { throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "잘못된 사이즈: " + v); }
    }

    private static Color parseColor(String v) {
        try { return Color.valueOf(Objects.requireNonNull(v)); }
        catch (Exception e) { throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "잘못된 색상: " + v); }
    }

    private static String key(Long pid, String size, String color) {
        return pid + "|" + size + "|" + color;
    }

    private record ResolvedProduct(Product p, Size size, Color color, ProductOption option) {}

    /** 상품/상태/옵션 재고까지 즉시 검증 */
    private ResolvedProduct resolveForWrite(Long productId, String s, String c) {
        Product p = productRepo.findById(productId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "상품 없음: " + productId));
        if (p.getStatus() != ProductStatus.ON_SALE) {
            throw new BasiliumCustomException(ErrorCode.CONFLICT, "판매중이 아닙니다.");
        }
        Size size = parseSize(s);
        Color color = parseColor(c);
        ProductOption opt = productOptionRepo.findOneOption(productId, size, color)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND,
                        "해당 옵션이 없습니다: " + productId + "/" + size + "/" + color));
        return new ResolvedProduct(p, size, color, opt);
    }

    /* ===== 합계(브랜드 할인 + 최적 쿠폰 1장) ===== */

    private CartDtos.TotalsView estimateTotals(String userId, List<CartItem> items) {
        if (items.isEmpty()) return CartDtos.TotalsView.zero();

        LocalDateTime now = LocalDateTime.now();

        // 제품 일괄 로드 (✔ 캐시 사용)
        List<Long> productIds = items.stream().map(CartItem::getProductId).distinct().toList();

        Map<Long, ProductRepository.BasicProjection> basics =
                catalog.getBasicsByIdsCached(productIds);

        Map<Long, Integer> brandPct =
                catalog.getActivePercentsByProductIdsCached(productIds, now);

        long original = 0L, brandDiscount = 0L;
        Map<Long, Long> unitAfterBrand = new HashMap<>();

        for (CartItem it : items) {
            var b = basics.get(it.getProductId());
            if (b == null) continue;
            long base = Optional.ofNullable(b.getProductPrice()).orElse(0L);
            int pct = Optional.ofNullable(brandPct.get(it.getProductId())).orElse(0);
            long after = Math.max(0L, base - roundPercent(base, pct));

            original      += base * it.getQuantity();
            brandDiscount += (base - after) * it.getQuantity();
            unitAfterBrand.put(it.getProductId(), after); // productId 단위 캐시
        }

        long afterBrand = Math.max(0L, original - brandDiscount);

        // 쿠폰 1장 최적(브랜드/상품 스코프)
        long bestCouponDiscount = 0L;
        var wallets = couponWalletRepo.findAllByUser_IdAndStatus(userId, NormalCouponWalletStatus.AVAILABLE);
        if (!wallets.isEmpty()) {
            for (var w : wallets) {
                var c = w.getCampaign();
                if (c == null) continue;
                if (c.getStartAt() != null && now.isBefore(c.getStartAt())) continue;
                if (c.getEndAt() != null && now.isAfter(c.getEndAt())) continue;

                long applicableBase = 0L;
                if (c.getScope() == BrandCouponScope.BRAND) {
                    for (var it : items) {
                        var b = basics.get(it.getProductId()); if (b == null) continue;
                        if (!Objects.equals(b.getBrandUserNumber(), c.getBrandUserNumber())) continue;
                        long after = unitAfterBrand.getOrDefault(it.getProductId(), 0L);
                        applicableBase += after * it.getQuantity();
                    }
                } else if (c.getScope() == BrandCouponScope.PRODUCT && c.getProduct() != null) {
                    Long pid = c.getProduct().getProductId();
                    for (var it : items) {
                        if (!Objects.equals(it.getProductId(), pid)) continue;
                        long after = unitAfterBrand.getOrDefault(pid, 0L);
                        applicableBase += after * it.getQuantity();
                    }
                }

                if (c.getMinOrderPrice() != null && applicableBase < c.getMinOrderPrice()) continue;
                long raw   = roundPercent(applicableBase, c.getPercent());
                long capped= (c.getMaxDiscountPrice() == null) ? raw : Math.min(raw, c.getMaxDiscountPrice());
                if (capped > bestCouponDiscount) bestCouponDiscount = capped;
            }
        }

        long finalPayable = Math.max(0L, afterBrand - bestCouponDiscount);
        return new CartDtos.TotalsView(original, brandDiscount, bestCouponDiscount, finalPayable);
    }

    /* ===== 조회/생성 ===== */

    // ✅ /me 만능: 바디 없으면 생성+조회, 바디 있으면 추가 후 전체 반환
    @Transactional
    public CartDtos.CartView ensureAndGetOrAdd(String userId, CartDtos.AddItemsReq req) {
        Objects.requireNonNull(userId);
        if (req == null || req.items() == null || req.items().isEmpty()) {
            return ensureAndGet(userId);
        }
        return addItems(userId, req);
    }

    /** 접근 시 없으면 생성해서 반환(created=true) — 생성 경합까지 안전하게 처리(유니크 충돌 흡수) */
    @Transactional
    public CartDtos.CartView ensureAndGet(String userId) {
        Objects.requireNonNull(userId);
        return withCartLock(userId, locked -> toView(locked.cart(), locked.created()));
    }

    /** 생성 없이 조회(없으면 빈 결과) — 읽기 전용은 락 없이 경량 처리 */
    @Transactional(readOnly = true)
    public CartDtos.CartView peek(String userId) {
        Objects.requireNonNull(userId);
        return cartRepo.findWithItemsByUserId(userId)
                .map(c -> toView(c, false))
                .orElseGet(() -> new CartDtos.CartView(null, userId, 0L, List.of(), CartDtos.TotalsView.zero(), false));
    }

    private CartDtos.CartView toView(Cart cart, boolean created) {
        final var now = LocalDateTime.now();

        // 정렬
        List<CartItem> sorted = cart.getItems().stream()
                .sorted(Comparator
                        .comparing(CartItem::getProductId)
                        .thenComparing(CartItem::getColor)
                        .thenComparing(CartItem::getSize))
                .toList();

        if (sorted.isEmpty()) {
            return new CartDtos.CartView(cart.getId(), cart.getNormalUserId(), cart.getTotalLines(),
                    List.of(), CartDtos.TotalsView.zero(), created);
        }

        // 일괄 준비
        List<Long> productIds = sorted.stream().map(CartItem::getProductId).distinct().toList();
        List<Color> colors = sorted.stream().map(it -> parseColor(it.getColor())).distinct().toList();
        List<Size> sizes   = sorted.stream().map(it -> parseSize(it.getSize())).distinct().toList();

        // 기본정보 (✔ 캐시 사용)
        Map<Long, ProductRepository.BasicProjection> basics =
                catalog.getBasicsByIdsCached(productIds);

        // 색상별 대표 이미지
        Map<String, List<String>> photoMap = new HashMap<>();
        for (var co : productRepo.findColorOptionsWithPhotos(productIds, colors)) {
            String k = co.getId().getProductId() + "|" + co.getId().getProductColor().name();
            photoMap.put(k, co.getProductPhotoUrls());
        }

        // 옵션 재고(옵션별 수량)
        Map<String, Long> optionQtyMap = new HashMap<>();
        productOptionRepo
                .findById_ProductIdInAndId_ProductColorInAndId_ProductSizeIn(productIds, colors, sizes)
                .forEach(po -> {
                    String k = po.getId().getProductId() + "|" + po.getId().getProductColor().name() + "|" + po.getId().getProductSize().name();
                    optionQtyMap.put(k, Optional.ofNullable(po.getOptionQuantity()).orElse(0L));
                });

        // 브랜드 할인 퍼센트 (✔ 캐시 사용)
        Map<Long, Integer> brandPct =
                catalog.getActivePercentsByProductIdsCached(productIds, now);

        // 1차: 라인 가격 합계(브랜드 할인까지)
        record LineCalc(CartItem it, long baseUnit, int pct, long unitAfterBrand, long lineAfterBrand) {}
        List<LineCalc> calcs = new ArrayList<>(sorted.size());
        long original = 0L, brandDiscount = 0L, afterBrandSum = 0L;

        for (var it : sorted) {
            var b = basics.get(it.getProductId());
            long base = (b == null || b.getProductPrice() == null) ? 0L : b.getProductPrice();
            int pct  = Optional.ofNullable(brandPct.get(it.getProductId())).orElse(0);
            long afterUnit = Math.max(0L, base - roundPercent(base, pct));
            long lineAfter = Math.max(0L, afterUnit * it.getQuantity());

            original      += base * it.getQuantity();
            brandDiscount += (base - afterUnit) * it.getQuantity();
            afterBrandSum += lineAfter;

            calcs.add(new LineCalc(it, base, pct, afterUnit, lineAfter));
        }

        // 2차: 최적 쿠폰 1장 선택
        long bestCouponDiscount = 0L;
        Integer bestCouponPercent = null;
        BrandCouponScope bestScope = null;
        Long bestBrandOwner = null; Long bestProductId = null;

        var wallets = couponWalletRepo.findAllByUser_IdAndStatus(
                cart.getNormalUserId(), NormalCouponWalletStatus.AVAILABLE);

        if (!wallets.isEmpty()) {
            for (var w : wallets) {
                var c = w.getCampaign();
                if (c == null) continue;
                if (c.getStartAt() != null && now.isBefore(c.getStartAt())) continue;
                if (c.getEndAt() != null && now.isAfter(c.getEndAt())) continue;

                long applicableBase = 0L;
                if (c.getScope() == BrandCouponScope.BRAND) {
                    for (var lc : calcs) {
                        var b = basics.get(lc.it.getProductId()); if (b == null) continue;
                        if (!Objects.equals(b.getBrandUserNumber(), c.getBrandUserNumber())) continue;
                        applicableBase += lc.lineAfterBrand;
                    }
                } else if (c.getScope() == BrandCouponScope.PRODUCT && c.getProduct() != null) {
                    Long pid = c.getProduct().getProductId();
                    for (var lc : calcs) {
                        if (Objects.equals(lc.it.getProductId(), pid)) applicableBase += lc.lineAfterBrand;
                    }
                }

                if (c.getMinOrderPrice() != null && applicableBase < c.getMinOrderPrice()) continue;
                long raw = roundPercent(applicableBase, c.getPercent());
                long capped = (c.getMaxDiscountPrice() == null) ? raw : Math.min(raw, c.getMaxDiscountPrice());

                if (capped > bestCouponDiscount) {
                    bestCouponDiscount = capped;
                    bestCouponPercent  = c.getPercent();
                    bestScope          = c.getScope();
                    bestBrandOwner     = c.getBrandUserNumber();
                    bestProductId      = (c.getProduct() == null) ? null : c.getProduct().getProductId();
                }
            }
        }

        // 3차: 쿠폰 비례배분(총합 정확히 일치)
        Map<Long, Long> perLineCoupon = new HashMap<>(); // key=itemId
        if (bestCouponDiscount > 0) {
            List<LineCalc> elig = new ArrayList<>();
            long eligSum = 0L;

            for (var lc : calcs) {
                boolean e = switch (bestScope) {
                    case BRAND   -> {
                        var b = basics.get(lc.it.getProductId());
                        yield b != null && Objects.equals(b.getBrandUserNumber(), bestBrandOwner);
                    }
                    case PRODUCT -> Objects.equals(lc.it.getProductId(), bestProductId);
                };
                if (e) { elig.add(lc); eligSum += lc.lineAfterBrand; }
            }

            if (eligSum > 0) {
                long allocated = 0L;
                Map<Long, BigDecimal> ratio = new HashMap<>();
                for (var lc : elig) {
                    BigDecimal r = BigDecimal.valueOf(lc.lineAfterBrand)
                            .divide(BigDecimal.valueOf(eligSum), 12, RoundingMode.HALF_UP);
                    ratio.put(lc.it.getId(), r);
                    long share = BigDecimal.valueOf(bestCouponDiscount).multiply(r)
                            .setScale(0, RoundingMode.HALF_UP).longValueExact();
                    perLineCoupon.put(lc.it.getId(), share);
                    allocated += share;
                }
                long diff = bestCouponDiscount - allocated;
                if (diff != 0) {
                    elig.sort((a, b) -> ratio.get(b.it.getId()).compareTo(ratio.get(a.it.getId())));
                    int i = 0; long remain = Math.abs(diff);
                    while (remain-- > 0) {
                        Long id = elig.get(i % elig.size()).it.getId();
                        perLineCoupon.compute(id, (k, v) -> v + (diff > 0 ? 1 : -1));
                        i++;
                    }
                }
            }
        }

        // 4차: 라인 뷰 조립
        List<CartDtos.CartItemView> items = new ArrayList<>(sorted.size());
        for (var lc : calcs) {
            var it = lc.it;
            var b = basics.get(it.getProductId());
            String photoKey = it.getProductId() + "|" + parseColor(it.getColor()).name();
            List<String> photos = photoMap.getOrDefault(photoKey, List.of());

            String optKey = it.getProductId() + "|" + parseColor(it.getColor()).name() + "|" + parseSize(it.getSize()).name();
            Long optQty = optionQtyMap.getOrDefault(optKey, 0L);

            long lineCoupon = perLineCoupon.getOrDefault(it.getId(), 0L);
            long finalLine  = Math.max(0L, lc.lineAfterBrand - lineCoupon);
            Integer lineCouponPct = (lineCoupon > 0 && bestCouponPercent != null) ? bestCouponPercent : null;

            items.add(new CartDtos.CartItemView(
                    it.getId(), it.getProductId(), it.getSize(), it.getColor(), it.getQuantity(),
                    (b == null ? ""  : b.getProductName()),
                    (b == null ? 0L  : Optional.ofNullable(b.getProductPrice()).orElse(0L)),
                    (b == null ? 0L  : Optional.ofNullable(b.getTotalQuantity()).orElse(0L)),
                    optQty,
                    photos,
                    lc.pct, lc.unitAfterBrand, lc.lineAfterBrand,
                    lineCouponPct, lineCoupon, finalLine,
                    (b == null ? 0L  : Optional.ofNullable(b.getBrandUserNumber()).orElse(0L)),
                    (b == null ? ""  : Optional.ofNullable(b.getBrandFirmName()).orElse(""))
            ));
        }

        long finalPayable = Math.max(0L, afterBrandSum - bestCouponDiscount);
        var totals = new CartDtos.TotalsView(original, brandDiscount, bestCouponDiscount, finalPayable);

        return new CartDtos.CartView(cart.getId(), cart.getNormalUserId(), cart.getTotalLines(), items, totals, created);
    }

    /* ===== 명령: 재고 검증 + 서버측 브랜드 정보 확정 (쓰기 경로: 전부 락) ===== */

    @Transactional
    public CartDtos.CartView addItem(String userId, CartDtos.AddItemReq req) {
        Objects.requireNonNull(userId);
        Objects.requireNonNull(req);

        return withCartLock(userId, locked -> {
            Cart cart = locked.cart();

            var r = resolveForWrite(req.productId(), req.size(), req.color());
            long requestQty = Optional.ofNullable(req.quantity()).orElse(0L);
            if (requestQty <= 0) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "수량은 1 이상이어야 합니다.");

            long existing = cart.getItems().stream()
                    .filter(it -> Objects.equals(it.getProductId(), req.productId())
                            && Objects.equals(it.getSize(), req.size())
                            && Objects.equals(it.getColor(), req.color()))
                    .mapToLong(CartItem::getQuantity).sum();

            long remain = Optional.ofNullable(r.option.getOptionQuantity()).orElse(0L) - existing;
            if (remain <= 0) throw new BasiliumCustomException(ErrorCode.CONFLICT, "재고가 부족합니다.");

            long allowedAdd = Math.min(requestQty, remain);

            cart.addOrIncrease(
                    req.productId(), req.size(), req.color(), allowedAdd,
                    r.p.getBrandUser().getUserNumber(),
                    Optional.ofNullable(r.p.getBrandUser().getFirmName()).orElse("")
            );

            return toView(cart, locked.created());
        });
    }

    @Transactional
    public CartDtos.CartView addItems(String userId, CartDtos.AddItemsReq req) {
        Objects.requireNonNull(userId);
        List<CartDtos.AddItemReq> list = Optional.ofNullable(req.items()).orElseGet(List::of);
        if (list.isEmpty()) return ensureAndGet(userId);

        return withCartLock(userId, locked -> {
            Cart cart = locked.cart();

            // 요청 중복 옵션 병합
            Map<String, Long> merged = new HashMap<>();
            Map<String, CartDtos.AddItemReq> first = new HashMap<>();
            for (var r : list) {
                String k = key(r.productId(), r.size(), r.color());
                merged.merge(k, Optional.ofNullable(r.quantity()).orElse(0L), Long::sum);
                first.putIfAbsent(k, r);
            }

            for (var e : merged.entrySet()) {
                var r0 = first.get(e.getKey());
                var r  = resolveForWrite(r0.productId(), r0.size(), r0.color());

                long reqQty = e.getValue();
                if (reqQty <= 0) continue;

                long existing = cart.getItems().stream()
                        .filter(it -> Objects.equals(it.getProductId(), r0.productId())
                                && Objects.equals(it.getSize(), r0.size())
                                && Objects.equals(it.getColor(), r0.color()))
                        .mapToLong(CartItem::getQuantity).sum();

                long remain = Optional.ofNullable(r.option.getOptionQuantity()).orElse(0L) - existing;
                if (remain <= 0) throw new BasiliumCustomException(ErrorCode.CONFLICT,
                        "재고가 부족합니다: " + r0.productId() + "/" + r0.size() + "/" + r0.color());

                long allowedAdd = Math.min(reqQty, remain);

                cart.addOrIncrease(
                        r0.productId(), r0.size(), r0.color(), allowedAdd,
                        r.p.getBrandUser().getUserNumber(),
                        Optional.ofNullable(r.p.getBrandUser().getFirmName()).orElse("")
                );
            }

            return toView(cart, locked.created());
        });
    }

    @Transactional
    public CartDtos.CartView updateItem(String userId, Long itemId, CartDtos.UpdateItemReq req) {
        Objects.requireNonNull(userId);
        Objects.requireNonNull(itemId);
        Objects.requireNonNull(req);

        return withCartLock(userId, locked -> {
            Cart cart = locked.cart();

            CartItem target = cart.getItems().stream()
                    .filter(it -> Objects.equals(it.getId(), itemId))
                    .findFirst()
                    .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "CartItem not found: " + itemId));

            long newQty = Optional.ofNullable(req.quantity()).orElse(0L);
            if (newQty <= 0) {
                cart.getItems().remove(target);
                if (cart.isEmpty()) { cartRepo.delete(cart); return new CartDtos.CartView(null, userId, 0L, List.of(), CartDtos.TotalsView.zero(), false); }
                return toView(cart, false);
            }

            String newSize = Objects.requireNonNull(req.size());
            String newColor= Objects.requireNonNull(req.color());

            var r = resolveForWrite(target.getProductId(), newSize, newColor);

            // 같은 옵션 라인(타겟 제외) 존재 시 병합 고려
            Optional<CartItem> dup = cart.getItems().stream()
                    .filter(it -> !Objects.equals(it.getId(), itemId))
                    .filter(it -> Objects.equals(it.getProductId(), target.getProductId())
                            && Objects.equals(it.getSize(), newSize)
                            && Objects.equals(it.getColor(), newColor))
                    .findFirst();

            long otherQty = dup.map(CartItem::getQuantity).orElse(0L);
            long remain = Optional.ofNullable(r.option.getOptionQuantity()).orElse(0L) - otherQty;
            if (remain <= 0) throw new BasiliumCustomException(ErrorCode.CONFLICT, "재고가 부족합니다.");

            long allowed = Math.min(newQty, remain);

            if (dup.isPresent()) {
                // 병합: dup = allowed, target 제거
                dup.get().setQuantity(allowed);
                cart.getItems().remove(target);
            } else {
                target.setSize(newSize);
                target.setColor(newColor);
                target.setQuantity(allowed);
            }

            return toView(cart, false);
        });
    }

    @Transactional
    public CartDtos.CartView removeItems(String userId, List<Long> itemIds) {
        Objects.requireNonNull(userId);
        List<Long> ids = itemIds == null ? List.of() : List.copyOf(itemIds);
        if (ids.isEmpty()) return peek(userId);

        return withCartLock(userId, locked -> {
            Cart cart = locked.cart();
            cart.removeItemsByIds(ids);
            if (cart.isEmpty()) {
                cartRepo.delete(cart);
                return new CartDtos.CartView(null, userId, 0L, List.of(), CartDtos.TotalsView.zero(), false);
            }
            return toView(cart, false);
        });
    }

    @Transactional
    public CartDtos.CartView removeByOption(String userId, Long productId, String size, String color) {
        Objects.requireNonNull(userId);
        Objects.requireNonNull(productId);
        Objects.requireNonNull(size);
        Objects.requireNonNull(color);

        return withCartLock(userId, locked -> {
            Cart cart = locked.cart();
            cart.removeByOption(productId, size, color);
            if (cart.isEmpty()) {
                cartRepo.delete(cart);
                return new CartDtos.CartView(null, userId, 0L, List.of(), CartDtos.TotalsView.zero(), false);
            }
            return toView(cart, false);
        });
    }

    /** 결제 성공 후: 옵션 일치(수량 무시) 라인 제거 → 비면 카트 삭제 (락 적용) */
    @Transactional
    public void removePurchasedOptions(String userId, List<CartDtos.PurchasedOptionSimple> purchased) {
        Objects.requireNonNull(userId);
        List<CartDtos.PurchasedOptionSimple> list = purchased == null ? List.of() : List.copyOf(purchased);
        if (list.isEmpty()) return;

        // 중복 제거
        List<CartDtos.PurchasedOptionSimple> distinct = list.stream().distinct().collect(Collectors.toList());

        withCartLock(userId, locked -> {
            Cart cart = locked.cart();
            List<Cart.PurchasedOptionSimple> opts = distinct.stream()
                    .map(o -> new Cart.PurchasedOptionSimple(o.productId(), o.size(), o.color()))
                    .toList();
            cart.removePurchasedOptions(opts);
            if (cart.isEmpty()) cartRepo.delete(cart);
            return null;
        });
    }

    /** (선택) 옵션+수량 완전 일치 제거 (락 적용) */
    @Transactional
    public void removePurchasedExactly(String userId, List<CartDtos.PurchasedOption> purchased) {
        Objects.requireNonNull(userId);
        List<CartDtos.PurchasedOption> list = purchased == null ? List.of() : List.copyOf(purchased);
        if (list.isEmpty()) return;

        withCartLock(userId, locked -> {
            Cart cart = locked.cart();
            List<Cart.PurchasedOption> opts = list.stream()
                    .map(o -> new Cart.PurchasedOption(o.productId(), o.size(), o.color(), o.quantity()))
                    .toList();

            cart.removePurchasedExactly(opts);
            if (cart.isEmpty()) cartRepo.delete(cart);
            return null;
        });
    }

    @Transactional
    public void clearAll(String userId) {
        Objects.requireNonNull(userId);
        withCartLock(userId, locked -> {
            Cart cart = locked.cart();
            cart.clearAll();
            cartRepo.delete(cart);
            return null;
        });
    }
}
