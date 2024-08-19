package basilium.basiliumserver.repository.user;

import basilium.basiliumserver.domain.user.NormalUser;

import java.util.Optional;

import basilium.basiliumserver.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<NormalUser, Long> {

    Optional<NormalUser> findByUserNumber(Long userNumber);

    Optional<NormalUser> findByEmailAddress(String userEmail);



}
/*
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUserNumber(Long userNumber);

    Optional<User> findById(String userId);
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAddress(String userEmail);

}


@Repository
public interface UserRepository<T extends User> extends JpaRepository<T, Long> {
    Optional<T> findById(String id);
}

 */