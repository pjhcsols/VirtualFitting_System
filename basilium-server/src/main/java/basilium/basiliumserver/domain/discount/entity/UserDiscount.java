package basilium.basiliumserver.domain.discount.entity;

import basilium.basiliumserver.domain.product.entity.Product;
import basilium.basiliumserver.domain.user.entity.BrandUser;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "user_discount",
        indexes = {
                // 실제 컬럼명(snake_case)로 맞춤
                @Index(name = "idx_ud_time", columnList = "active,start_at,end_at"),
                @Index(name = "idx_ud_user_product", columnList = "user_number,product_id"),
                @Index(name = "idx_ud_user_brand", columnList = "user_number,brand_user_number")
        }
)
public class UserDiscount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 대상 유저 */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_number", nullable = false)
    private NormalUser user;

    /** 브랜드 스코프(브랜드 전상품). product가 null일 때만 의미 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_user_number")
    private BrandUser brandUser;

    /** 상품 스코프(상품 한정). 지정 시 브랜드 스코프보다 우선 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    /** 0~90% (브랜드 기본할인 이후 추가로 적용되는 퍼센트) */
    @Column(nullable = false)
    private Integer extraPercent;

    /** 활성/기간 */
    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "start_at", nullable = false)
    private LocalDateTime startAt;

    @Column(name = "end_at", nullable = false)
    private LocalDateTime endAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (extraPercent == null) extraPercent = 0;
        extraPercent = Math.max(0, Math.min(90, extraPercent));
        if (active == null) active = true;
    }

    /** 유효성: 브랜드/상품 둘 다 null인 경우 방지(애플리케이션 레벨에서 보장) */
    @Transient
    public boolean hasValidScope() {
        return (brandUser != null) || (product != null);
    }

    /* 선택: 더티체킹용 편의 함수 */
    public void changeActive(Boolean active) {
        if (active != null) this.active = active;
    }
    public void changePeriod(LocalDateTime startAt, LocalDateTime endAt) {
        if (startAt != null) this.startAt = startAt;
        if (endAt != null) this.endAt = endAt;
    }
}
