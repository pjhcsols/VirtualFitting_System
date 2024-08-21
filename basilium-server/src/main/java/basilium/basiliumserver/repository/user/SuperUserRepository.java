package basilium.basiliumserver.repository.user;

import basilium.basiliumserver.domain.user.NormalUser;
import basilium.basiliumserver.domain.user.SuperUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface SuperUserRepository extends JpaRepository<SuperUser, Long> {

    // 기존 메서드 시그니처 유지
    Optional<SuperUser> findById(String id);

    Optional<SuperUser> findByEmailAddress(String emailAddress);

    @Query("SELECT m.userImageUrl FROM SuperUser m")
    List<String> getAllUserImageUrls();

    @Query("SELECT u FROM SuperUser u WHERE u.userImageUrl IN :imageUrls")
    List<SuperUser> findByUserImageUrlsIn(@Param("imageUrls") Set<String> imageUrls);

    @Query("SELECT s.userProfileImageUrl FROM SuperUser s")
    List<String> getAllUserProfileUrls();

    @Query("SELECT u FROM SuperUser u WHERE u.userProfileImageUrl IN :imageUrls")
    List<SuperUser> findByUserProfileUrlsIn(@Param("imageUrls") Set<String> imageUrls);


}


/*
import basilium.basiliumserver.domain.user.SuperUser;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface SuperUserRepository {
    long count();
    void modify(SuperUser superUser);
    List<SuperUser> getAllSuperUsers();
    SuperUser save(SuperUser superUser);
    Optional<SuperUser> findById(String id);
    Optional<SuperUser> findByEmail(String emailAddress);

    List<SuperUser> findByUserImageUrlIn(Set<String> imageUrls);

    List<String> getAllUserImageUrls();
    List<SuperUser> findByUserImageUrlsIn(Set<String> imageUrls);
    List<String> getAllUserProfileUrls();
    List<SuperUser> findByUserProfileUrlsIn(Set<String> imageUrls);
}

 */
