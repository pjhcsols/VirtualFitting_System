// src/main/java/basilium/basiliumserver/domain/coupon/entity/NormalCouponWallet.java
package basilium.basiliumserver.domain.coupon.entity;

import basilium.basiliumserver.domain.user.entity.NormalUser;
import jakarta.persistence.*;
        import lombok.*;

        import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "normal_coupon_wallet",
        uniqueConstraints = {
                // 정책이 “캠페인당 1장”이면 활성화:
                //@UniqueConstraint(name="uk_wallet_user_campaign", columnNames={"user_number","campaign_id"})
        },
        indexes = {
                @Index(name = "idx_ncw_user_status", columnList = "user_number,status"),
                @Index(name = "idx_ncw_campaign",    columnList = "campaign_id")
        }
)
public class NormalCouponWallet {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 소유자(일반 유저) */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_number", nullable = false)
    private NormalUser user;

    /** 원천 캠페인 */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "campaign_id", nullable = false)
    private BrandCouponCampaign campaign;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private NormalCouponWalletStatus status;

    @Column(name = "claimed_at", nullable = false, updatable = false)
    private LocalDateTime claimedAt;

    @Column(name = "used_at")
    private LocalDateTime usedAt;

    @Column(name = "used_order_id", length = 40)
    private String usedOrderId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (claimedAt == null) claimedAt = createdAt;
        if (status == null) status = NormalCouponWalletStatus.AVAILABLE;
    }

    public boolean isAvailable() { return status == NormalCouponWalletStatus.AVAILABLE; }

    /** 결제 승인 직후 원자적 소모(서비스에서 consumeAvailable JPQL과 함께 사용) */
    public void consume(String orderId) {
        status = NormalCouponWalletStatus.USED;
        usedAt = LocalDateTime.now();
        usedOrderId = orderId;
    }
}
