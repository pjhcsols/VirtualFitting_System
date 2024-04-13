package basilium.basiliumserver.repository.user;

import basilium.basiliumserver.domain.user.NormalUser;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaUserRepo extends JpaRepository<NormalUser, String> {

    Optional<NormalUser> findByUserNumber(Long userId);

    Optional<NormalUser> findByEmailAddress(String userEmail);



}