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
        private Long paymentId;  // [추가] 리뷰 적립(10%)을 위한 결제 라인 식별자

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
        private final List<String> imageUrls;   // 클라에는 '풀 URL' 리스트 반환
        private final LocalDateTime createdAt;
        private final LocalDateTime updatedAt;
    }

    @Getter @AllArgsConstructor
    public static class ReviewsResponse {
        private final double averageRating;
        private final Page<Response> reviews;
    }

    /** 네이티브 프로젝션: CSV 파일명 별칭은 reviewImageUrls */
    public interface ReviewProjection {
        Long getReviewId();
        String getMaskedUserId();
        String getPurchaseSize();
        String getPurchaseColor();
        int    getRating();
        String getTitle();
        String getComment();
        String getReviewImageUrls(); // CSV of file names
        LocalDateTime getCreatedAt();
        LocalDateTime getUpdatedAt();
    }
}
