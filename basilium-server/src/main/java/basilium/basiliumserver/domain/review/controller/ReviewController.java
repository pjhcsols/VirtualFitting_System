package basilium.basiliumserver.domain.review.controller;

import basilium.basiliumserver.domain.review.dto.ReviewDto;
import basilium.basiliumserver.domain.review.service.ReviewService;
import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.auth.support.AuthUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/b1/products/{productId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /** 기본 목록 (최신순) */
    @GetMapping
    public ResponseEntity<ApiResponse<ReviewDto.ReviewsResponse>> getReviews(
            @PathVariable Long productId,
            @PageableDefault(page = 0, size = 5)
            @SortDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) Integer ageGroup
    ) {
        var resp = reviewService.getReviews(productId, pageable, ageGroup);
        return ResponseEntity.ok(ApiResponse.success(resp));
    }

    /** 내 리뷰 먼저 + 최신순 */
    @GetMapping("/mine-first")
    public ResponseEntity<ApiResponse<ReviewDto.ReviewsResponse>> getReviewsMineFirst(
            @PathVariable Long productId,
            @AuthUser(required = false) String userId,
            @PageableDefault(page = 0, size = 5)
            @SortDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) Integer ageGroup
    ) {
        var resp = reviewService.getReviewsMineFirst(productId, userId, pageable, ageGroup);
        return ResponseEntity.ok(ApiResponse.success(resp));
    }

    /** 생성 */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ReviewDto.Response>> createReview(
            @PathVariable Long productId,
            @AuthUser String userId,
            @Valid @RequestPart("review") ReviewDto.Request req,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        var resp = reviewService.createReview(productId, userId, req, images);
        return ResponseEntity.status(201).body(ApiResponse.success(resp));
    }

    /** 수정 */
    @PatchMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewDto.Request req
    ) {
        reviewService.updateReview(reviewId, req);
        return ResponseEntity.ok(ApiResponse.success());
    }

    /** 삭제 */
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok(ApiResponse.success());
    }

    /** 내 모든 리뷰만 보기*/
    @GetMapping("/me/my")
    public ResponseEntity<ApiResponse<Page<ReviewDto.Response>>> getMyReviews(
            @AuthUser String userId,
            @PageableDefault(page = 0, size = 10)
            @SortDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        var page = reviewService.getMyReviewsAllProducts(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }
}
