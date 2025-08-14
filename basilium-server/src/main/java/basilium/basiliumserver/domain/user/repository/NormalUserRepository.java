package basilium.basiliumserver.domain.user.repository;

import basilium.basiliumserver.domain.deliveryInfo.DeliveryInfo;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface NormalUserRepository extends JpaRepository<NormalUser, Long> {

    @Query("select u from NormalUser u where u.id = :id")
    Optional<NormalUser> findById(String id);

    @Query("select u.userImageUrl from NormalUser u where u.userImageUrl is not null")
    List<String> getAllUserImageUrls();

    @Query("select u from NormalUser u where u.userImageUrl in :imageUrls")
    List<NormalUser> findByUserImageUrlsIn(Set<String> imageUrls);

    @Query("select u.userProfileImageUrl from NormalUser u where u.userProfileImageUrl is not null")
    List<String> getAllUserProfileUrls();

    @Query("select u from NormalUser u where u.userProfileImageUrl in :imageUrls")
    List<NormalUser> findByUserProfileUrlsIn(Set<String> imageUrls);

    @Query("SELECT d FROM DeliveryInfo d WHERE d.normalUser.userNumber = :userNumber")
    DeliveryInfo findDeliveryInfoByUserNumber(@Param("userNumber") Long userNumber);

    /* ===== 벌크 NULL 처리 ===== */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update NormalUser u set u.userImageUrl = null where u.userImageUrl in :names")
    int clearUserImageUrlsIn(@Param("names") Set<String> names);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update NormalUser u set u.userProfileImageUrl = null where u.userProfileImageUrl in :names")
    int clearUserProfileUrlsIn(@Param("names") Set<String> names);
}
