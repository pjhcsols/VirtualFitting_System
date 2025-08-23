// src/main/java/basilium/basiliumserver/domain/coupon/service/CouponService.java
package basilium.basiliumserver.domain.coupon.service;

import basilium.basiliumserver.domain.coupon.dto.CouponDtos.*;
import basilium.basiliumserver.domain.coupon.entity.*;
import basilium.basiliumserver.domain.coupon.repository.*;
import basilium.basiliumserver.domain.discount.repository.ProductDiscountRepository;
import basilium.basiliumserver.domain.product.entity.Product;
import basilium.basiliumserver.domain.product.repository.ProductRepository;
import basilium.basiliumserver.domain.user.entity.BrandUser;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import basilium.basiliumserver.domain.user.repository.BrandUserRepository;
import basilium.basiliumserver.domain.user.repository.NormalUserRepository;
import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class CouponService {

    private final BrandCouponCampaignRepository campaignRepo;
    private final NormalCouponWalletRepository walletRepo;
    private final BrandUserRepository brandUserRepo;
    private final NormalUserRepository normalUserRepo;
    private final ProductRepository productRepo;
    private final ProductDiscountRepository productDiscountRepo;

    /* ===== 내부 유틸 ===== */

    private static long roundPercent(long base, int percent) {
        if (base <= 0 || percent <= 0) return 0L;
        return BigDecimal.valueOf(base)
                .multiply(BigDecimal.valueOf(percent).divide(BigDecimal.valueOf(100)))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();
    }

    private static long cap(Long value, Long cap) {
        if (value <= 0) return 0L;
        if (cap == null) return value;
        return Math.min(value, cap);
    }

    private BrandUser findBrandOrThrow(String brandUserId) {
        return brandUserRepo.findById(brandUserId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.MEMBER_NOT_FOUND, "브랜드 회원이 아닙니다."));
    }

    private NormalUser findUserOrThrow(Long userNumber) {
        return normalUserRepo.findById(userNumber)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.MEMBER_NOT_FOUND, "대상 유저 없음"));
    }

    private Product findProductOrThrow(Long productId) {
        return productRepo.findById(productId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "상품 없음: " + productId));
    }

    /* ===== 1) 브랜드: 캠페인 관리 ===== */

    /** 내 캠페인 목록(페이지네이션) */
    public Page<CampaignResponse> listMyCampaigns(String authBrandUserId, Pageable pageable) {
        BrandUser me = findBrandOrThrow(authBrandUserId);
        return campaignRepo.findAllByBrand(me.getUserNumber(), pageable)
                .map(this::toCampaignResp);
    }

    /** 캠페인 생성 */
    @Transactional
    public CampaignResponse createCampaign(String authBrandUserId, CampaignCreateRequest req) {
        BrandUser me = findBrandOrThrow(authBrandUserId);

        if (req.getScope() == null)
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "scope 필수");
        if (req.getPercent() == null || req.getPercent() < 1 || req.getPercent() > 90)
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "percent는 1~90");
        if (req.getStartAt() == null || req.getEndAt() == null || !req.getStartAt().isBefore(req.getEndAt()))
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "유효하지 않은 기간");

        Product product = null;
        if (req.getScope() == BrandCouponScope.PRODUCT) {
            if (req.getProductId() == null)
                throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "productId 필수");
            product = findProductOrThrow(req.getProductId());
            if (!Objects.equals(product.getBrandUser().getUserNumber(), me.getUserNumber()))
                throw new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "본인 상품만 지정 가능");
        }

        BrandCouponCampaign c = BrandCouponCampaign.builder()
                .brandUserNumber(me.getUserNumber())
                .scope(req.getScope())
                .product(product)
                .percent(req.getPercent())
                .minOrderPrice(Optional.ofNullable(req.getMinOrderPrice()).orElse(0L))
                .maxDiscountPrice(req.getMaxDiscountPrice())
                .startAt(req.getStartAt())
                .endAt(req.getEndAt())
                .perUserLimit(Optional.ofNullable(req.getPerUserLimit()).orElse(1))
                .totalIssuable(Optional.ofNullable(req.getTotalIssuable()).orElse(0L))
                .issuedCount(0L)
                .status(BrandCouponCampaignStatus.SCHEDULED) // onCreate에서 현재 시각으로 재계산
                .build();

        BrandCouponCampaign saved = campaignRepo.save(c);
        return toCampaignResp(saved);
    }

    /** 캠페인 수정(본인 캠페인만) */
    @Transactional
    public CampaignResponse updateCampaign(String authBrandUserId, Long campaignId, CampaignUpdateRequest req) {
        BrandUser me = findBrandOrThrow(authBrandUserId);
        BrandCouponCampaign c = campaignRepo.findById(campaignId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "캠페인 없음: " + campaignId));

        if (!Objects.equals(c.getBrandUserNumber(), me.getUserNumber()))
            throw new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "본인 캠페인만 수정 가능");

        Product product = null;
        if (req.getScope() == BrandCouponScope.PRODUCT) {
            if (req.getProductId() == null)
                throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "productId 필수");
            product = findProductOrThrow(req.getProductId());
            if (!Objects.equals(product.getBrandUser().getUserNumber(), me.getUserNumber()))
                throw new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "본인 상품만 지정 가능");
        }

        if (req.getPercent() != null && (req.getPercent() < 1 || req.getPercent() > 90))
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "percent는 1~90");

        if (req.getStartAt() != null || req.getEndAt() != null) {
            LocalDateTime s = Optional.ofNullable(req.getStartAt()).orElse(c.getStartAt());
            LocalDateTime e = Optional.ofNullable(req.getEndAt()).orElse(c.getEndAt());
            if (!s.isBefore(e)) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "유효하지 않은 기간");
        }

        c.changeFields(
                req.getPercent(),
                req.getMinOrderPrice(),
                req.getMaxDiscountPrice(),
                req.getScope(),
                product,
                req.getPerUserLimit(),
                req.getTotalIssuable(),
                req.getStartAt(),
                req.getEndAt(),
                LocalDateTime.now()
        );
        return toCampaignResp(c);
    }

    /* ===== 2) 상품 상세: 발급 가능 조회 / 발급 ===== */

    /** 상품 상세: 발급/노출 가능 캠페인 조회(브랜드/상품 범위 동시 노출) */
    public List<ClaimableOnProductView> listClaimablesOnProduct(Long productId, Long userNumber) {
        Product product = findProductOrThrow(productId);
        Long brandUserNumber = product.getBrandUser().getUserNumber();
        LocalDateTime now = LocalDateTime.now();

        long base = Optional.ofNullable(product.getProductPrice()).orElse(0L);
        int brandPercent = productDiscountRepo.findActivePercentNow(productId, now).orElse(0);
        long discountedUnit = base - roundPercent(base, brandPercent);

        List<BrandCouponCampaign> cs = campaignRepo.findClaimablesForProduct(productId, brandUserNumber, now);
        if (cs.isEmpty()) return Collections.emptyList();

        Map<Long, Long> alreadyMap = cs.stream().collect(Collectors.toMap(
                BrandCouponCampaign::getId,
                c -> walletRepo.countByUserAndCampaign(userNumber, c.getId())
        ));

        List<ClaimableOnProductView> out = new ArrayList<>();
        for (BrandCouponCampaign c : cs) {
            long estRaw = roundPercent(discountedUnit, c.getPercent());
            long est = cap(estRaw, c.getMaxDiscountPrice());
            int remaining = Math.max(0, c.getPerUserLimit() - alreadyMap.getOrDefault(c.getId(), 0L).intValue());

            out.add(ClaimableOnProductView.builder()
                    .campaignId(c.getId())
                    .scope(c.getScope())
                    .percent(c.getPercent())
                    .maxDiscountPrice(c.getMaxDiscountPrice())
                    .minOrderPrice(c.getMinOrderPrice())
                    .estimatedDiscountOnThisProduct(est)
                    .endAt(c.getEndAt())
                    .alreadyClaimed(alreadyMap.getOrDefault(c.getId(), 0L) > 0)
                    .remainingCanClaim(remaining)
                    .build());
        }
        return out;
    }

    /** 상품 상세: 다운(발급) 버튼 → 지갑 생성(1인 N장 정책은 perUserLimit로 제어) */
    @Transactional
    public WalletClaimResponse claimWallet(Long userNumber, Long campaignId) {
        NormalUser user = findUserOrThrow(userNumber);
        BrandCouponCampaign c = campaignRepo.findById(campaignId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "캠페인 없음"));

        LocalDateTime now = LocalDateTime.now();
        if (!c.isActiveNow(now)) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "쿠폰 기간이 아님");

        long owned = walletRepo.countByUserAndCampaign(user.getUserNumber(), c.getId());
        if (owned >= c.getPerUserLimit()) throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "발급 한도 초과");

        if (c.getTotalIssuable() > 0 && c.getIssuedCount() >= c.getTotalIssuable())
            throw new BasiliumCustomException(ErrorCode.BAD_REQUEST, "총 발급 수량 소진");

        c.increaseIssued();
        campaignRepo.save(c);

        NormalCouponWallet saved = walletRepo.save(NormalCouponWallet.builder()
                .user(user)
                .campaign(c)
                .status(NormalCouponWalletStatus.AVAILABLE)
                .build());

        return WalletClaimResponse.builder()
                .walletId(saved.getId())
                .campaignId(c.getId())
                .percent(c.getPercent())
                .maxDiscountPrice(c.getMaxDiscountPrice())
                .build();
    }

    /* ===== 3) 체크아웃 옵션(결제창) ===== */

    /**
     * 결제창: 사용자 보유(AVAILABLE) 쿠폰을 라인 정보로 평가하여 옵션 리스트 구성
     * - eligibleBase: 쿠폰 범위(브랜드/상품)에 해당하는 라인의 (상품할인단가×수량) 합
     * - discountAmount: min(round(eligibleBase*percent/100), maxDiscountPrice)
     * - 한 주문에 1개만 사용(선택/적용은 결제 흐름에서 보장)
     */
    public List<CheckoutCouponOption> buildOptionsForCheckout(
            Long userNumber,
            List<Long> productIds,
            Map<Long, Long> qtyByProductId,
            Map<Long, Long> discountedUnitPriceByProductId
    ) {
        List<NormalCouponWallet> wallets =
                walletRepo.findAllByUserAndStatus(userNumber, NormalCouponWalletStatus.AVAILABLE);
        if (wallets.isEmpty()) return Collections.emptyList();

        LocalDateTime now = LocalDateTime.now();
        Map<Long, Product> products = productRepo.findAllById(productIds).stream()
                .collect(Collectors.toMap(Product::getProductId, it -> it));

        List<CheckoutCouponOption> out = new ArrayList<>();
        for (NormalCouponWallet w : wallets) {
            BrandCouponCampaign c = w.getCampaign();
            if (!c.isActiveNow(now)) continue;

            long eligibleBase = 0L;
            for (Long pid : productIds) {
                Product p = products.get(pid);
                long qty = qtyByProductId.getOrDefault(pid, 0L);
                long unit = discountedUnitPriceByProductId.getOrDefault(pid, 0L);
                if (qty <= 0 || unit <= 0) continue;

                boolean match = (c.getScope() == BrandCouponScope.BRAND && Objects.equals(p.getBrandUser().getUserNumber(), c.getBrandUserNumber()))
                        || (c.getScope() == BrandCouponScope.PRODUCT && c.getProduct() != null && Objects.equals(c.getProduct().getProductId(), pid));
                if (match) eligibleBase += unit * qty;
            }

            boolean applicable = eligibleBase > 0
                    && (c.getMinOrderPrice() == null || eligibleBase >= c.getMinOrderPrice());

            long discount = applicable
                    ? cap(roundPercent(eligibleBase, c.getPercent()), c.getMaxDiscountPrice())
                    : 0L;

            String label = buildLabel(c);

            out.add(CheckoutCouponOption.builder()
                    .walletId(w.getId())
                    .campaignId(c.getId())
                    .scope(c.getScope())
                    .percent(c.getPercent())
                    .maxDiscountPrice(c.getMaxDiscountPrice())
                    .minOrderPrice(c.getMinOrderPrice())
                    .eligibleBase(eligibleBase)
                    .discountAmount(discount)
                    .applicableNow(applicable)
                    .label(label)
                    .build());
        }
        out.sort(Comparator.comparingLong(CheckoutCouponOption::getDiscountAmount).reversed());
        return out;
    }

    /** 결제 승인 직후 선택된 1개 지갑을 원자적으로 USED 처리(멱등) */
    @Transactional
    public void consumeWalletOnSuccess(Long userNumber, Long walletId, String orderId) {
        NormalCouponWallet w = walletRepo.findByIdAndUser_UserNumber(walletId, userNumber)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "소유 쿠폰 아님"));
        int updated = walletRepo.consumeAvailable(walletId, orderId);
        if (updated != 1) throw new BasiliumCustomException(ErrorCode.CONFLICT, "이미 사용된 쿠폰");
    }

    private CampaignResponse toCampaignResp(BrandCouponCampaign c) {
        return CampaignResponse.builder()
                .id(c.getId())
                .brandUserNumber(c.getBrandUserNumber())
                .scope(c.getScope())
                .productId(Optional.ofNullable(c.getProduct()).map(Product::getProductId).orElse(null))
                .percent(c.getPercent())
                .minOrderPrice(c.getMinOrderPrice())
                .maxDiscountPrice(c.getMaxDiscountPrice())
                .startAt(c.getStartAt())
                .endAt(c.getEndAt())
                .perUserLimit(c.getPerUserLimit())
                .totalIssuable(c.getTotalIssuable())
                .issuedCount(c.getIssuedCount())
                .status(c.getStatus())
                .createdAt(c.getCreatedAt())
                .build();
    }

    private String buildLabel(BrandCouponCampaign c) {
        String scopeText = (c.getScope() == BrandCouponScope.BRAND) ? "브랜드" : "상품";
        String capText = Optional.ofNullable(c.getMaxDiscountPrice())
                .map(v -> " (최대 " + v + "원)")
                .orElse("");
        return scopeText + " " + c.getPercent() + "% 할인" + capText;
    }
}
