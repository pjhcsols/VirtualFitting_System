// src/main/java/basilium/basiliumserver/domain/cart/entity/CartItem.java
package basilium.basiliumserver.domain.cart.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Objects;

/**
 * CartItem
 * - UNIQUE(cart_id, product_id, size, color)
 * - 가격 스냅샷 금지(6필드만) — Payment/Order에서만 금액 고정
 */
@Entity
@Table(
        name = "cart_item",
        uniqueConstraints = {
                @UniqueConstraint(name = "ux_cart_item_option",
                        columnNames = {"cart_id", "product_id", "size", "color"})
        },
        indexes = {
                @Index(name = "idx_cart_item_cart", columnList = "cart_id"),
                @Index(name = "idx_cart_item_product", columnList = "product_id")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CartItem {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 부모 */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    /** 6필드 중 1 — 상품ID */
    @Column(name = "product_id", nullable = false)
    private Long productId;

    /** 6필드 중 2 — 사이즈 */
    @Column(name = "size", nullable = false, length = 30)
    private String size;

    /** 6필드 중 3 — 색상 */
    @Column(name = "color", nullable = false, length = 30)
    private String color;

    /** 6필드 중 4 — 수량 */
    @Column(name = "quantity", nullable = false)
    private Long quantity;

    /** 6필드 중 5 — 브랜드 번호(조회 최적화용) */
    @Column(name = "brand_user_number", nullable = false)
    private Long brandUserNumber;

    /** 6필드 중 6 — 브랜드명(조회 정렬/표시용) */
    @Column(name = "brand_firm_name", nullable = false, length = 200)
    private String brandFirmName;

    private CartItem(Cart cart, Long productId, String size, String color, Long quantity,
                     Long brandUserNumber, String brandFirmName) {
        this.cart = Objects.requireNonNull(cart);
        this.productId = Objects.requireNonNull(productId);
        this.size = Objects.requireNonNull(size);
        this.color = Objects.requireNonNull(color);
        this.quantity = Math.max(0L, Objects.requireNonNull(quantity));
        this.brandUserNumber = Objects.requireNonNull(brandUserNumber);
        this.brandFirmName = Objects.requireNonNull(brandFirmName);
    }

    public static CartItem of(Cart cart, Long productId, String size, String color, Long quantity,
                              Long brandUserNumber, String brandFirmName) {
        return new CartItem(cart, productId, size, color, quantity, brandUserNumber, brandFirmName);
    }

    /* ==== 변경 메서드(더티체킹) ==== */

    public void increase(Long by) {
        long inc = Math.max(0L, Objects.requireNonNull(by));
        this.quantity = this.quantity + inc;
    }

    public void setQuantity(Long q) {
        this.quantity = Math.max(0L, Objects.requireNonNull(q));
    }

    public void setSize(String size) { this.size = Objects.requireNonNull(size); }

    public void setColor(String color) { this.color = Objects.requireNonNull(color); }
}
