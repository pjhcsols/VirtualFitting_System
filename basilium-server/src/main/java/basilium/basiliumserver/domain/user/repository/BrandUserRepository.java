package basilium.basiliumserver.domain.user.repository;

import basilium.basiliumserver.domain.user.entity.BrandUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface BrandUserRepository extends JpaRepository<BrandUser, Long> {
/*
    Optional<BrandUser> findByUserNumber(Long userNumber);
    // 이메일로 객체 찾기: 메소드 이름을 findByEmailAddress로 수정
    Optional<BrandUser> findByEmailAddress(String emailAddress);

    @Query("SELECT b.userNumber FROM BrandUser b WHERE b.id = :id")
    Optional<String> findByNumber(@Param("id") String id);

    @Query("SELECT b FROM BrandUser b WHERE b.userNumber = :userNumber")
    Optional<BrandUser> findByBrandUserOfNumber(@Param("userNumber") Long userNumber);
 */


    @Query("select u from BrandUser u where u.id = :id")
    Optional<BrandUser> findById(String id);

    @Query("select u from BrandUser u where u.userNumber = :userNumber")
    Optional<BrandUser> findByBrandUserOfNumber(Long userNumber);

    @Query("select cast(u.userNumber as string) from BrandUser u where u.id = :id")
    Optional<String> findByNumber(String id);

    /** 중복 대조(가입 시 1회씩) */
    boolean existsById(String userId);
    boolean existsByEmailAddress(String emailAddress);
    boolean existsByPhoneNumber(String phoneNumber);
    // 자기 자신 제외 중복 검사
    boolean existsByIdAndUserNumberNot(String id, Long userNumber);
    boolean existsByEmailAddressAndUserNumberNot(String email, Long userNumber);
    boolean existsByPhoneNumberAndUserNumberNot(String phone, Long userNumber);


    /* 일반/프로필 이미지(파일명) 수집 */
    @Query("select u.userImageUrl from BrandUser u where u.userImageUrl is not null")
    List<String> getAllUserImageUrls();

    @Query("select u from BrandUser u where u.userImageUrl in :imageUrls")
    List<BrandUser> findByUserImageUrlsIn(Set<String> imageUrls);

    @Query("select u.userProfileImageUrl from BrandUser u where u.userProfileImageUrl is not null")
    List<String> getAllUserProfileUrls();

    @Query("select u from BrandUser u where u.userProfileImageUrl in :imageUrls")
    List<BrandUser> findByUserProfileUrlsIn(Set<String> imageUrls);

    /* ==== 배치용: 사업자등록증 파일명 전체/역참조 ==== */
    @Query("select u.businessRegistrationCertificateImageUrl from BrandUser u where u.businessRegistrationCertificateImageUrl is not null")
    List<String> getAllBusinessCertFileNames();

    @Query("select u from BrandUser u where u.businessRegistrationCertificateImageUrl in :fileNames")
    List<BrandUser> findByBusinessCertIn(@Param("fileNames") Set<String> fileNames);

    /* ===== 벌크 NULL 처리 ===== */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update BrandUser u set u.userImageUrl = null where u.userImageUrl in :names")
    int clearUserImageUrlsIn(@Param("names") Set<String> names);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update BrandUser u set u.userProfileImageUrl = null where u.userProfileImageUrl in :names")
    int clearUserProfileUrlsIn(@Param("names") Set<String> names);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update BrandUser u set u.businessRegistrationCertificateImageUrl = null " +
            "where u.businessRegistrationCertificateImageUrl in :names")
    int clearBusinessCertIn(@Param("names") Set<String> names);
}