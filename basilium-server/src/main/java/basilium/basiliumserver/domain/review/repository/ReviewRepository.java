// 3. ReviewRepository.java
package basilium.basiliumserver.domain.review.repository;

import basilium.basiliumserver.domain.review.dto.ReviewDto;
import basilium.basiliumserver.domain.review.dto.ReviewDto.ReviewProjection;
import basilium.basiliumserver.domain.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    /**
     * 한 번의 SQL 호출로 리뷰 + 유저 + 이미지 URL 리스트(CSV)를 가져오는 네이티브 쿼리
     */
    /*
    @Query(value = """
        SELECT
          r.review_id              AS reviewId,
          u.id                     AS maskedUserId,
          r.purchase_size          AS purchaseSize,
          r.purchase_color         AS purchaseColor,
          r.rating                 AS rating,
          r.title                  AS title,
          r.comment                AS comment,
          GROUP_CONCAT(ri.image_url ORDER BY ri.image_url 
                       SEPARATOR ',') AS imageUrls,
          r.created_at             AS createdAt,
          r.updated_at             AS updatedAt
        FROM review r
        JOIN normal_user u      ON u.user_number = r.normal_user_number
        LEFT JOIN review_images ri ON ri.review_id = r.review_id
        WHERE r.product_id = :productId
        GROUP BY r.review_id
        ORDER BY r.created_at DESC
        """, countQuery = """
        SELECT COUNT(DISTINCT r.review_id)
        FROM review r
        WHERE r.product_id = :productId
        """, nativeQuery = true
    )
    Page<ReviewProjection> fetchReviewDtos(
            @Param("productId") Long productId,
            Pageable pageable
    );

     */

    /**
     * 리뷰 + 유저 + 이미지 URL 리스트(CSV) + updatedAt, ageGroup 필터 포함
     */
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
          GROUP_CONCAT(ri.image_url ORDER BY ri.image_url SEPARATOR ',') AS imageUrls,
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
    Page<ReviewProjection> fetchReviewDtos(
            @Param("productId") Long productId,
            @Param("ageGroup")   Integer ageGroup,
            Pageable pageable
    );

    /** 상품별 평균 평점 계산 */
    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r WHERE r.product.id = :productId")
    double findAverageRatingByProductId(@Param("productId") Long productId);
}
