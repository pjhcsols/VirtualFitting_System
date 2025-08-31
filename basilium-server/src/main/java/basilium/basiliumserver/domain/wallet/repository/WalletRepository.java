// src/main/java/basilium/basiliumserver/domain/wallet/repository/WalletRepository.java
package basilium.basiliumserver.domain.wallet.repository;

import basilium.basiliumserver.domain.wallet.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
    Optional<Wallet> findByUserNumber(Long userNumber);
}
