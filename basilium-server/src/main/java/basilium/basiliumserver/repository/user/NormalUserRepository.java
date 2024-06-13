package basilium.basiliumserver.repository.user;

import basilium.basiliumserver.domain.user.DeliveryInfo;
import basilium.basiliumserver.domain.user.NormalUser;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.Set;

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
    List<String> getAllUserImageUrls();
    List<NormalUser> findByUserImageUrlsIn(Set<String> imageUrls);
    //@Query("SELECT u.userProfileImageUrl FROM NormalUser u")
    List<String> getAllUserProfileUrls();
    List<NormalUser> findByUserProfileUrlsIn(Set<String> imageUrls);

}