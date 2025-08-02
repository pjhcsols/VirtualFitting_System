package basilium.basiliumserver.domain.user.repository;

import basilium.basiliumserver.domain.user.entity.SuperUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface SuperUserRepository extends JpaRepository<SuperUser, Long> {

    // 기존 메서드 시그니처 유지
    @Override
    @EntityGraph(attributePaths = "bannerImageFileUrls")
    Page<SuperUser> findAll(Pageable pageable);

    @EntityGraph(attributePaths = "bannerImageFileUrls")
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