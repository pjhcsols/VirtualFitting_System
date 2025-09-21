// src/main/java/basilium/basiliumserver/domain/user/repository/SuperUserRepository.java
package basilium.basiliumserver.domain.user.repository;

import basilium.basiliumserver.domain.user.entity.SuperUser;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface SuperUserRepository extends JpaRepository<SuperUser, Long> {

    Optional<SuperUser> findByEmailAddress(String emailAddress);

    // 중복 검사용(로그인 ID, 이메일, 전화)
    boolean existsByIdIs(String id);
    boolean existsByEmailAddress(String emailAddress);
    boolean existsByPhoneNumber(String phoneNumber);

    @NotNull
    @EntityGraph(attributePaths = "bannerImageFileUrls")
    Page<SuperUser> findAll(@NotNull Pageable pageable);

    @Query("select u from SuperUser u where u.id = :id")
    @EntityGraph(attributePaths = "bannerImageFileUrls")
    Optional<SuperUser> findById(@Param("id") String id);

    @Query("select u.userImageUrl from SuperUser u where u.userImageUrl is not null")
    List<String> getAllUserImageUrls();

    @Query("select u from SuperUser u where u.userImageUrl in :imageUrls")
    List<SuperUser> findByUserImageUrlsIn(Set<String> imageUrls);

    @Query("select u.userProfileImageUrl from SuperUser u where u.userProfileImageUrl is not null")
    List<String> getAllUserProfileUrls();

    @Query("select u from SuperUser u where u.userProfileImageUrl in :imageUrls")
    List<SuperUser> findByUserProfileUrlsIn(Set<String> imageUrls);

    /* ==== 배너 파일명 전체/역참조 ==== */
    @Query("select b from SuperUser u join u.bannerImageFileUrls b")
    List<String> getAllBannerFileNames();

    @EntityGraph(attributePaths = "bannerImageFileUrls")
    @Query("select distinct u from SuperUser u join u.bannerImageFileUrls b where b in :fileNames")
    List<SuperUser> findAllWithBannersIn(@Param("fileNames") Set<String> fileNames);

    // 새 메서드 추가 1: 배너 파일명 집합에 걸린 슈퍼유저 PK만 가볍게 조회
    @Query("""
      select distinct u.userNumber
      from SuperUser u
      join u.bannerImageFileUrls b
      where b in :fileNames
    """)
    List<Long> findUserNumbersHavingAnyBannerIn(@Param("fileNames") Set<String> fileNames);

    // 새 메서드 추가 2: 위에서 뽑은 PK들로 배너 컬렉션까지 한 번에 로딩
    @EntityGraph(attributePaths = "bannerImageFileUrls")
    List<SuperUser> findByUserNumberIn(Collection<Long> ids);

    /* ===== 벌크 NULL 처리 ===== */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update SuperUser u set u.userImageUrl = null where u.userImageUrl in :names")
    int clearUserImageUrlsIn(@Param("names") Set<String> names);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update SuperUser u set u.userProfileImageUrl = null where u.userProfileImageUrl in :names")
    int clearUserProfileUrlsIn(@Param("names") Set<String> names);
}