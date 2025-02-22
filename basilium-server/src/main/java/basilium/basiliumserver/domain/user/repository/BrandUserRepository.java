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



/*
import basilium.basiliumserver.user.domain.BrandUser;
import basilium.basiliumserver.user.domain.NormalUser;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface BrandUserRepository {
    long count();
    void modify(BrandUser brandUser);
    List<BrandUser> getAllBrandUsers();
    BrandUser save(BrandUser brandUser);
    Optional<BrandUser> findById(String id); //id로 객체찾기
    Optional<BrandUser> findByEmail(String emailAddress);
    List<String> getAllUserImageUrls();
    List<BrandUser> findByUserImageUrlsIn(Set<String> imageUrls);
    Optional<String> findByNumber(String id); //id로 number찾기
    Optional<BrandUser> findByBrandUserOfNumber(Long userNumber); //number로 브랜드유저 찾기
    List<String> getAllUserProfileUrls();
    List<BrandUser> findByUserProfileUrlsIn(Set<String> imageUrls);
}


 */