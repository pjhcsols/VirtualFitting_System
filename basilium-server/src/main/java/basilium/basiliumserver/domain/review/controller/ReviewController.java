// 5. ReviewController.java
package basilium.basiliumserver.domain.review.controller;

import basilium.basiliumserver.domain.review.dto.ReviewDto;
import basilium.basiliumserver.domain.review.service.ReviewService;

import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.auth.support.AuthUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.Arrays;
import java.util.List;

//빈값 반환 변경하기 No content로
@RestController
@RequestMapping("/b1/products/{productId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<ApiResponse<ReviewDto.ReviewsResponse>> getReviews(
            @PathVariable Long productId,
            @PageableDefault(page = 0, size = 5)
            @SortDefault(sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable,
            @RequestParam(required = false) Integer ageGroup
    ) {
        ReviewDto.ReviewsResponse resp = reviewService.getReviews(productId, pageable, ageGroup);
        return ResponseEntity.ok(ApiResponse.success(resp));
    }


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ReviewDto.Response>> createReview(
            @PathVariable Long productId,
            @AuthUser String userId,
            @Valid @RequestPart("review") ReviewDto.Request req,
            @RequestPart(value="images", required=false) List<MultipartFile> images
    ) {
        return ResponseEntity.status(201).body(
                ApiResponse.success(
                        reviewService.createReview(productId, userId, req, images)
                )
        );
    }

    @PatchMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewDto.Request req
    ) {
        reviewService.updateReview(reviewId, req);
        return ResponseEntity.ok(ApiResponse.success());
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @PathVariable Long reviewId
    ) {
        reviewService.deleteReview(reviewId);
        /*
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(ApiResponse.success(null));

         */
        return ResponseEntity.ok(ApiResponse.success()); //Optional.empty()
    }

    //normalUser 자기가 쓴 리뷰 가져오기 (상품전체)

    //normalUser의 자신이 쓴 리뷰를 젤 위에 리스트 업하고 나머지를 시간순 정렬 (상품 1개에 대한 자신의 리뷰)

    //숫자 뒤에서 3개 블러 수정
}
