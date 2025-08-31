// src/main/java/basilium/basiliumserver/domain/wallet/repository/WalletLedgerRepository.java
package basilium.basiliumserver.domain.wallet.repository;

import basilium.basiliumserver.domain.wallet.entity.WalletLedger;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletLedgerRepository extends JpaRepository<WalletLedger, Long> {

    boolean existsByUniqueKey(String uniqueKey);

    Page<WalletLedger> findByUser_UserNumberOrderByCreatedAtDesc(Long userNumber, Pageable pageable);
}
