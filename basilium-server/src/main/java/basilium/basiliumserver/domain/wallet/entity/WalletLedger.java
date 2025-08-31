// src/main/java/basilium/basiliumserver/domain/wallet/entity/WalletLedger.java
package basilium.basiliumserver.domain.wallet.entity;

import basilium.basiliumserver.domain.user.entity.NormalUser;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// wallet 장부
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "wallet_ledger",
        indexes = {
                @Index(name = "idx_wl_user_created", columnList = "user_number,created_at"),
                @Index(name = "idx_wl_unique", columnList = "unique_key", unique = true)
        }
)
public class WalletLedger {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_number", nullable = false)
    private NormalUser user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private WalletLedgerType type; // CREDIT/DEBIT

    @Enumerated(EnumType.STRING)
    @Column(name = "ref_type", nullable = false, length = 24)
    private WalletLedgerRefType refType; // REVIEW / ORDER_CONFIRMED / PAYMENT / ADJUST

    @Column(name = "ref_id", length = 64)
    private String refId; // paymentId, orderId 등 식별자

    @Column(nullable = false)
    private Long amount;

    @Column(name = "balance_after", nullable = false)
    private Long balanceAfter;

    @Column(name = "unique_key", nullable = false, length = 80, unique = true)
    private String uniqueKey;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
