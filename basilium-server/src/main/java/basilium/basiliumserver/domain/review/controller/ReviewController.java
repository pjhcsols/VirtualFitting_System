package basilium.basiliumserver.domain.review.controller;

import basilium.basiliumserver.domain.review.controller.apiDocs.ReviewApiDocs;
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
public class ReviewController implements ReviewApiDocs {

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

    /*
    오류 수정: 리뷰 조회할때 image가 없는데 다른 기능 전부 다 이렇게 조립되어서 반환되는지 파악 필요, 이미지가 없으면 조립해서 주지말고 그냥 반환값에서 빼면된다.
    {
  "timestamp": "2025-09-03T21:00:52.990333+09:00",
  "status": 200,
  "code": "OK",
  "message": "요청에 성공하였습니다.",
  "data": {
    "reviewId": 6,
    "maskedUserId": "exam***",
    "purchaseSize": "M",
    "purchaseColor": "BLACK",
    "rating": 5,
    "title": "gk",
    "comment": "gd",
    "imageUrls": [
      "basilium.co.kr/b1/images/userReviewImageStorage/normal_example_20250903210052_1."
    ],
    "createdAt": "2025-09-03T21:00:52.985066",
    "updatedAt": "2025-09-03T21:00:52.985066"
  }
}
     */
    /** 생성 */
    /** 생성 (멀티파트 전용) */
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
