// src/main/java/basilium/basiliumserver/domain/wallet/entity/Wallet.java
package basilium.basiliumserver.domain.wallet.entity;

import basilium.basiliumserver.domain.user.entity.NormalUser;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "wallet")
public class Wallet {

    /* NormalUser.userNumber 와 동일한 PK (1:1) */
    @Id
    @Column(name = "user_number")
    private Long userNumber;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId
    @JoinColumn(name = "user_number")
    private NormalUser user;

    @Column(nullable = false)
    private Long balance; // >= 0

    @Version
    private Long version;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        if (balance == null) balance = 0L;
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /* 내부 증가/감소: 서비스에서만 호출(낙관잠금 재시도) */
    public void increase(long amount) {
        if (amount <= 0) throw new IllegalArgumentException("amount > 0");
        balance = balance + amount;
    }

    public void decrease(long amount) {
        if (amount <= 0) throw new IllegalArgumentException("amount > 0");
        if (balance < amount) throw new IllegalStateException("잔액 부족");
        balance = balance - amount;
    }
}
