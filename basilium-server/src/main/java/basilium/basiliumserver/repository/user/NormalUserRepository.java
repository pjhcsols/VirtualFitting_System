package basilium.basiliumserver.repository.user;

import basilium.basiliumserver.domain.deliveryInfo.DeliveryInfo;
import basilium.basiliumserver.domain.user.NormalUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface NormalUserRepository extends JpaRepository<NormalUser, Long> {

    Optional<NormalUser> findById(String id);

    Optional<NormalUser> findByEmailAddress(String emailAddress);

    List<NormalUser> findByName(String name);

    Optional<NormalUser> findByPhoneNumber(String phoneNumber);

    @Query("SELECT u.userImageUrl FROM NormalUser u")
    List<String> getAllUserImageUrls();

    @Query("SELECT u FROM NormalUser u WHERE u.userImageUrl IN :imageUrls")
    List<NormalUser> findByUserImageUrlsIn(@Param("imageUrls") Set<String> imageUrls);

    @Query("SELECT u.userProfileImageUrl FROM NormalUser u")
    List<String> getAllUserProfileUrls();

    @Query("SELECT u FROM NormalUser u WHERE u.userProfileImageUrl IN :imageUrls")
    List<NormalUser> findByUserProfileUrlsIn(@Param("imageUrls") Set<String> imageUrls);

    @Query("SELECT d FROM DeliveryInfo d WHERE d.normalUser.userNumber = :userNumber")
    DeliveryInfo findDeliveryInfoByUserNumber(@Param("userNumber") Long userNumber);
}

/*
import basilium.basiliumserver.domain.user.NormalUser;

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
    List<String> getAllUserProfileUrls();
    List<NormalUser> findByUserProfileUrlsIn(Set<String> imageUrls);

}

 */