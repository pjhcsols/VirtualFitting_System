// 3. ReviewRepository.java
package basilium.basiliumserver.domain.review.repository;

import basilium.basiliumserver.domain.review.dto.ReviewDto;
import basilium.basiliumserver.domain.review.dto.ReviewDto.ReviewProjection;
import basilium.basiliumserver.domain.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface ReviewRepository extends JpaRepository<Review, Long> {


    /**
     * 리뷰 + 유저 + 이미지 URL CSV + 선택적 연령대 필터
     * - 성능: 단일 네이티브 쿼리/집계, COUNT 분리
     * - 정렬/페이징은 Pageable로 처리
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
            @Param("ageGroup") Integer ageGroup,
            Pageable pageable
    );

    /** 상품별 평균 평점 계산 */
    /** 상품별 평균 평점 (null → 0) */
    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r WHERE r.product.id = :productId")
    double findAverageRatingByProductId(@Param("productId") Long productId);

    /* ====== 배치용: 리뷰 이미지 파일명 전체/역참조 ====== */

    /** 모든 리뷰 이미지 파일명 수집 (ElementCollection join) */
    @Query("select img from Review r join r.imageUrls img")
    List<String> getAllReviewImageFileNames();

    /**
     * 특정 파일명을 참조하는 리뷰 조회
     * - N+1 방지: imageUrls 함께 로딩
     * - distinct로 중복 제거
     */
    @EntityGraph(attributePaths = "imageUrls")
    @Query("select distinct r from Review r join r.imageUrls img where img in :fileNames")
    List<Review> findAllWithImagesIn(@Param("fileNames") Set<String> fileNames);

}
