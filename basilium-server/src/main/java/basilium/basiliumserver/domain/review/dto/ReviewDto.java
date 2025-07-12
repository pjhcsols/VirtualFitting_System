// 2. ReviewDto.java (DTO)
package basilium.basiliumserver.domain.review.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;


import java.time.LocalDateTime;
import java.util.List;

public class ReviewDto {

    @Getter @Setter
    public static class Request {
        @NotNull @Min(1) @Max(5)
        private Integer rating;

        @NotBlank @Size(max = 100)
        private String title;

        @NotBlank @Size(max = 1000)
        private String comment;

        @NotBlank
        private String purchaseSize;

        @NotBlank
        private String purchaseColor;
    }

    @Getter @AllArgsConstructor
    public static class Response {
        private final Long reviewId;
        private final String maskedUserId;
        private final String purchaseSize;
        private final String purchaseColor;
        private final int rating;
        private final String title;
        private final String comment;
        private final List<String> imageUrls;
        private final LocalDateTime createdAt;
        private final LocalDateTime updatedAt;
    }

    // 전체 응답을 감쌀 래퍼 DTO
    @Getter @AllArgsConstructor
    public static class ReviewsResponse {
        private final double averageRating;        // 상품 평균 평점
        private final Page<Response> reviews;      // 페이징된 리뷰 목록
    }

    /**
     * ◆ 추가: JPA 프로젝션 인터페이스
     *  - 한 번의 SQL로 리뷰+유저+이미지 URL 집합을 묶어서 가져옵니다.
     */
    public interface ReviewProjection {
        Long getReviewId();
        String getMaskedUserId();
        String getPurchaseSize();
        String getPurchaseColor();
        int    getRating();
        String getTitle();
        String getComment();
        String getImageUrls();      // CSV 문자열
        LocalDateTime getCreatedAt();
        LocalDateTime getUpdatedAt();
    }
}
