// src/main/java/basilium/basiliumserver/domain/cart/entity/Cart.java
package basilium.basiliumserver.domain.cart.entity;

import basilium.basiliumserver.global.jpa.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.BatchSize;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Cart (유저 1명당 1개, NORMAL 전용)
 * - userId: NormalUser.id(문자열, 고유)
 * - totalLines: 서로 다른 옵션 라인 수(= items.size)
 * - createdAt/updatedAt: BaseTimeEntity(JPA Auditing) 자동
 */
@Entity
@Table(
        name = "cart",
        uniqueConstraints = @UniqueConstraint(name="ux_cart_user", columnNames = "normal_user_id")
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Cart extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 한 유저 당 1개의 장바구니 — NormalUser.id(문자열, 고유) */
    @Column(name = "normal_user_id", nullable = false, updatable = false, length = 100)
    private String normalUserId;

    /** 서로 다른 옵션 라인 수 (= items.size) */
    @Column(name = "total_lines", nullable = false)
    private Long totalLines = 0L;

    /** 장바구니 라인들 */
    @BatchSize(size = 100)
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    private Cart(String normalUserId) {
        this.normalUserId = Objects.requireNonNull(normalUserId);
        this.totalLines = 0L;
    }

    public static Cart createFor(String normalUserId) {
        return new Cart(normalUserId);
    }

    /* ========= 내부 유틸 ========= */

    private static String keyOf(Long productId, String size, String color) {
        return String.valueOf(Objects.requireNonNull(productId)) + "|" +
                Objects.requireNonNull(size) + "|" +
                Objects.requireNonNull(color);
    }

    private void recalcTotals() {
        this.totalLines = (long) this.items.size();
    }

    private Optional<CartItem> findLine(Long productId, String size, String color) {
        String k = keyOf(productId, size, color);
        for (CartItem it : this.items) {
            String cur = keyOf(it.getProductId(), it.getSize(), it.getColor());
            if (cur.equals(k)) return Optional.of(it);
        }
        return Optional.empty();
    }

    /* ========= 명령 ========= */

    /** 단건 추가(동일 옵션 존재 시 수량만 증가) */
    public void addOrIncrease(Long productId, String size, String color, Long quantity,
                              Long brandUserNumber, String brandFirmName) {
        long qty = Optional.ofNullable(quantity).orElse(0L);
        if (qty <= 0) return;

        CartItem target = findLine(productId, size, color)
                .orElseGet(() -> {
                    CartItem created = CartItem.of(this, productId, size, color, 0L,
                            Optional.ofNullable(brandUserNumber).orElse(0L),
                            Optional.ofNullable(brandFirmName).orElse(""));
                    this.items.add(created);
                    return created;
                });
        target.increase(qty);
        recalcTotals();
    }

    /** 여러 라인(요청 중 중복 옵션은 합쳐서 반영) */
    public void addOrIncreaseAll(Collection<CartItem> candidates) {
        if (candidates == null || candidates.isEmpty()) return;

        // 요청 중복 옵션 합치기
        final Map<String, Long> merged = new HashMap<>(Math.max(4, candidates.size() * 2));
        final Map<String, CartItem> first = new HashMap<>();
        for (CartItem c : candidates) {
            String k = keyOf(c.getProductId(), c.getSize(), c.getColor());
            merged.merge(k, c.getQuantity(), Long::sum);
            first.putIfAbsent(k, c);
        }
        // 적용
        for (Map.Entry<String, Long> e : merged.entrySet()) {
            CartItem ref = first.get(e.getKey());
            addOrIncrease(ref.getProductId(), ref.getSize(), ref.getColor(), e.getValue(),
                    ref.getBrandUserNumber(), ref.getBrandFirmName());
        }
        recalcTotals();
    }

    /** 옵션으로 제거(모두 제거) */
    public void removeByOption(Long productId, String size, String color) {
        this.items.removeIf(it ->
                Objects.equals(it.getProductId(), productId)
                        && Objects.equals(it.getSize(), size)
                        && Objects.equals(it.getColor(), color));
        recalcTotals();
    }

    /** itemId들로 제거 */
    public void removeItemsByIds(Collection<Long> itemIds) {
        if (itemIds == null || itemIds.isEmpty()) return;
        Set<Long> idSet = new HashSet<>(itemIds);
        this.items.removeIf(it -> idSet.contains(it.getId()));
        recalcTotals();
    }

    /** 옵션 일치(상품/사이즈/색상, 수량 무시) 라인들 제거 — 결제 성공 후 호출 */
    public void removePurchasedOptions(List<PurchasedOptionSimple> purchased) {
        if (purchased == null || purchased.isEmpty()) return;
        final Set<String> keys = purchased.stream()
                .map(p -> keyOf(p.productId, p.size, p.color))
                .collect(Collectors.toSet());

        this.items.removeIf(it -> keys.contains(keyOf(it.getProductId(), it.getSize(), it.getColor())));
        recalcTotals();
    }

    /** 옵션+수량 완전 일치 제거(선택적) */
    public void removePurchasedExactly(List<PurchasedOption> purchased) {
        if (purchased == null || purchased.isEmpty()) return;

        Map<String, Long> qtyMap = new HashMap<>();
        for (PurchasedOption p : purchased) {
            qtyMap.merge(keyOf(p.productId, p.size, p.color),
                    Optional.ofNullable(p.quantity).orElse(0L), Long::sum);
        }

        // 같은 옵션 여러 라인일 수 없지만(UNIQUE), 혹시 모를 중복 방지
        this.items.removeIf(it -> {
            String k = keyOf(it.getProductId(), it.getSize(), it.getColor());
            Long q = qtyMap.getOrDefault(k, 0L);
            return q > 0 && Objects.equals(it.getQuantity(), q);
        });
        recalcTotals();
    }

    /** 라인 수정: 옵션/수량 변경 (수량<=0이면 제거, 옵션 변경 시 기존 라인과 병합) */
    public void updateItem(Long itemId, String newSize, String newColor, Long newQuantity) {
        Objects.requireNonNull(itemId);
        String s = Objects.requireNonNull(newSize);
        String c = Objects.requireNonNull(newColor);
        long qty = Optional.ofNullable(newQuantity).orElse(0L);

        CartItem target = this.items.stream()
                .filter(it -> Objects.equals(it.getId(), itemId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("CartItem not found: " + itemId));

        if (qty <= 0) {
            this.items.remove(target);
            recalcTotals();
            return;
        }

        boolean optionChanged = !Objects.equals(target.getSize(), s) || !Objects.equals(target.getColor(), c);
        if (!optionChanged) {
            target.setQuantity(qty);
            recalcTotals();
            return;
        }

        // 옵션 변경 → 같은 옵션 라인이 이미 있으면 병합, 없으면 대상 라인의 옵션/수량만 변경
        Optional<CartItem> dup = findLine(target.getProductId(), s, c);
        if (dup.isPresent()) {
            // 병합(기존 + 변경수량), 대상 라인 제거
            dup.get().increase(qty);
            this.items.remove(target);
        } else {
            target.setSize(s);
            target.setColor(c);
            target.setQuantity(qty);
        }
        recalcTotals();
    }

    /** 전체 비우기 */
    public void clearAll() {
        this.items.clear();
        recalcTotals();
    }

    public boolean isEmpty() {
        return this.items.isEmpty();
    }

    /* ==== 결제 후 장바구니 정리용 값 객체 ==== */
    @lombok.Value
    public static class PurchasedOptionSimple {
        Long productId; String size; String color;
    }

    @lombok.Value
    public static class PurchasedOption {
        Long productId; String size; String color; Long quantity;
    }
}
