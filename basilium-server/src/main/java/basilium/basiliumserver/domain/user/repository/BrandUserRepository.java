package basilium.basiliumserver.domain.user.repository;

import basilium.basiliumserver.domain.user.entity.BrandUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface BrandUserRepository extends JpaRepository<BrandUser, Long> {

    Optional<BrandUser> findByUserNumber(Long userNumber);
    Optional<BrandUser> findById(String userId);
    // 이메일로 객체 찾기: 메소드 이름을 findByEmailAddress로 수정
    Optional<BrandUser> findByEmailAddress(String emailAddress);
    boolean existsById(String userId);

    @Query("SELECT b.userImageUrl FROM BrandUser b")
    List<String> getAllUserImageUrls();

    @Query("SELECT b FROM BrandUser b WHERE b.userImageUrl IN :imageUrls")
    List<BrandUser> findByUserImageUrlsIn(@Param("imageUrls") Set<String> imageUrls);

    @Query("SELECT b.userNumber FROM BrandUser b WHERE b.id = :id")
    Optional<String> findByNumber(@Param("id") String id);

    @Query("SELECT b FROM BrandUser b WHERE b.userNumber = :userNumber")
    Optional<BrandUser> findByBrandUserOfNumber(@Param("userNumber") Long userNumber);

    @Query("SELECT b.userProfileImageUrl FROM BrandUser b")
    List<String> getAllUserProfileUrls();

    @Query("SELECT b FROM BrandUser b WHERE b.userProfileImageUrl IN :imageUrls")
    List<BrandUser> findByUserProfileUrlsIn(@Param("imageUrls") Set<String> imageUrls);
}