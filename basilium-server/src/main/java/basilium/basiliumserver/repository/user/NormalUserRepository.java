package basilium.basiliumserver.repository.user;

import basilium.basiliumserver.domain.user.NormalUser;

import java.util.List;
import java.util.Optional;

public interface NormalUserRepository {
    long count();
    void delete(NormalUser normalUser);
    void deleteById(String id);
    void deleteAll();
    void modify(NormalUser normalUser);

    List<NormalUser> getAllNormalUsers();

    NormalUser save(NormalUser normalUser);
    Optional<NormalUser> findById(String id);
    Optional<NormalUser> findByEmail(String emailAddress);
    List<NormalUser> findByName(String name);
    Optional<NormalUser> findByPhoneNumber(String phoneNumber);
    List<NormalUser> findAll();
}