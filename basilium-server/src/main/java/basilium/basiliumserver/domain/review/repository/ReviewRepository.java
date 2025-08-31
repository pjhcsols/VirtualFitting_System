package basilium.basiliumserver.domain.review.repository;

import basilium.basiliumserver.domain.review.dto.ReviewDto;
import basilium.basiliumserver.domain.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Set;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    /** 기본 목록(상품별, 선택적 연령대) */
    @Query(
            value = """
        SELECT
          r.review_id              AS reviewId,
          u.id                     AS maskedUserId,
          r.purchase_size          AS purchaseSize,
          r.purchase_color         AS purchaseColor,
          r.rating                 AS rating,
          r.title                  AS title,
          r.comment                AS comment,
          GROUP_CONCAT(ri.image_file_name ORDER BY ri.image_file_name SEPARATOR ',') AS reviewImageUrls,
          r.created_at             AS createdAt,
          r.updated_at             AS updatedAt
        FROM review r
        JOIN normal_user u
          ON u.user_number = r.normal_user_number
        LEFT JOIN review_images ri
          ON ri.review_id = r.review_id
        WHERE r.product_id = :productId
          AND (
            :ageGroup IS NULL
            OR (
              FLOOR(DATEDIFF(CURRENT_DATE, u.birth_date)/365) BETWEEN :ageGroup
                AND CASE WHEN :ageGroup < 60 THEN :ageGroup + 9 ELSE 999 END
            )
          )
        GROUP BY r.review_id
        """,
            countQuery = """
        SELECT COUNT(DISTINCT r.review_id)
        FROM review r
        JOIN normal_user u
          ON u.user_number = r.normal_user_number
        WHERE r.product_id = :productId
          AND (
            :ageGroup IS NULL
            OR (
              FLOOR(DATEDIFF(CURRENT_DATE, u.birth_date)/365) BETWEEN :ageGroup
                AND CASE WHEN :ageGroup < 60 THEN :ageGroup + 9 ELSE 999 END
            )
          )
        """,
            nativeQuery = true
    )
    Page<ReviewDto.ReviewProjection> fetchReviewDtos(
            @Param("productId") Long productId,
            @Param("ageGroup") Integer ageGroup,
            Pageable pageable
    );

    /** 내 리뷰 먼저 정렬 */
    @Query(
            value = """
        SELECT
          r.review_id              AS reviewId,
          u.id                     AS maskedUserId,
          r.purchase_size          AS purchaseSize,
          r.purchase_color         AS purchaseColor,
          r.rating                 AS rating,
          r.title                  AS title,
          r.comment                AS comment,
          GROUP_CONCAT(ri.image_file_name ORDER BY ri.image_file_name SEPARATOR ',') AS reviewImageUrls,
          r.created_at             AS createdAt,
          r.updated_at             AS updatedAt
        FROM review r
        JOIN normal_user u
          ON u.user_number = r.normal_user_number
        LEFT JOIN review_images ri
          ON ri.review_id = r.review_id
        WHERE r.product_id = :productId
          AND (
            :ageGroup IS NULL
            OR (
              FLOOR(DATEDIFF(CURRENT_DATE, u.birth_date)/365) BETWEEN :ageGroup
                AND CASE WHEN :ageGroup < 60 THEN :ageGroup + 9 ELSE 999 END
            )
          )
        GROUP BY r.review_id
        ORDER BY CASE WHEN u.id = :userId THEN 0 ELSE 1 END ASC, r.created_at DESC
        """,
            countQuery = """
        SELECT COUNT(DISTINCT r.review_id)
        FROM review r
        JOIN normal_user u
          ON u.user_number = r.normal_user_number
        WHERE r.product_id = :productId
          AND (
            :ageGroup IS NULL
            OR (
              FLOOR(DATEDIFF(CURRENT_DATE, u.birth_date)/365) BETWEEN :ageGroup
                AND CASE WHEN :ageGroup < 60 THEN :ageGroup + 9 ELSE 999 END
            )
          )
        """,
            nativeQuery = true
    )
    Page<ReviewDto.ReviewProjection> fetchReviewDtosMineFirst(
            @Param("productId") Long productId,
            @Param("userId") String userId,
            @Param("ageGroup") Integer ageGroup,
            Pageable pageable
    );

    /** 내가 쓴 리뷰(상품 전체) */
    @Query(
            value = """
        SELECT
          r.review_id              AS reviewId,
          u.id                     AS maskedUserId,
          r.purchase_size          AS purchaseSize,
          r.purchase_color         AS purchaseColor,
          r.rating                 AS rating,
          r.title                  AS title,
          r.comment                AS comment,
          GROUP_CONCAT(ri.image_file_name ORDER BY ri.image_file_name SEPARATOR ',') AS reviewImageUrls,
          r.created_at             AS createdAt,
          r.updated_at             AS UpdatedAt
        FROM review r
        JOIN normal_user u
          ON u.user_number = r.normal_user_number
        LEFT JOIN review_images ri
          ON ri.review_id = r.review_id
        WHERE u.id = :userId
        GROUP BY r.review_id
        ORDER BY r.created_at DESC
        """,
            countQuery = """
        SELECT COUNT(DISTINCT r.review_id)
        FROM review r
        JOIN normal_user u
          ON u.user_number = r.normal_user_number
        WHERE u.id = :userId
        """,
            nativeQuery = true
    )
    Page<ReviewDto.ReviewProjection> fetchMyReviewDtos(
            @Param("userId") String userId,
            Pageable pageable
    );

    /** 평균 평점 */
    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r WHERE r.product.id = :productId")
    double findAverageRatingByProductId(@Param("productId") Long productId);

    /* ===== 배치 ===== */

    @Query("select img from Review r join r.reviewImageUrls img")
    List<String> getAllReviewImageFileNames();

    @EntityGraph(attributePaths = "reviewImageUrls")
    @Query("select distinct r from Review r join r.reviewImageUrls img where img in :fileNames")
    List<Review> findAllWithImagesIn(@Param("fileNames") Set<String> fileNames);

    // 새 메서드 추가 1: 이미지 파일명 집합에 걸린 리뷰 ID만 가볍게 조회
    @Query("""
      select distinct r.reviewId
      from Review r
      join r.reviewImageUrls img
      where img in :fileNames
    """)
    List<Long> findReviewIdsHavingAnyOf(@Param("fileNames") Set<String> fileNames);

    // 새 메서드 추가 2: 위에서 뽑은 리뷰 ID들로 전체 컬렉션을 한 번에 로딩
    @EntityGraph(attributePaths = "reviewImageUrls")
    List<Review> findByReviewIdIn(Collection<Long> ids);
}
