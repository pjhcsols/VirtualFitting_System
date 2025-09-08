// src/main/java/basilium/basiliumserver/domain/review/controller/apiDocs/ReviewApiDocs.java
package basilium.basiliumserver.domain.review.controller.apiDocs;

import basilium.basiliumserver.domain.review.dto.ReviewDto;
import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.auth.support.AuthUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Encoding;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.List;

@Tag(name = "리뷰", description = "상품 리뷰 목록/생성/수정/삭제 API")
@RequestMapping("/b1/products/{productId}/reviews")
public interface ReviewApiDocs {

    /* 목록 (최신순) */
    @Operation(
            summary = "리뷰 목록(최신순)",
            description = """
                    특정 상품의 리뷰를 페이지로 조회합니다.
                    - 정렬: createdAt DESC
                    - ageGroup(선택): 서비스 내부에서 10단위 버킷팅(예: 23 → 20)
                    권한: 공개
                    """
    )
    @GetMapping
    ResponseEntity<ApiResponse<ReviewDto.ReviewsResponse>> getReviews(
            @Parameter(description = "상품 ID", required = true) @PathVariable Long productId,
            @ParameterObject Pageable pageable,
            @Parameter(description = "연령대 필터(선택, 정수). 내부적으로 10단위 버킷화", required = false)
            @RequestParam(required = false) Integer ageGroup
    );

    /* 내 리뷰 먼저 + 최신순 */
    @Operation(
            summary = "내 리뷰 먼저 + 최신순",
            description = """
                    로그인 사용자의 리뷰를 우선 노출하고, 이후 최신순으로 정렬해 응답합니다.
                    권한: 선택(미로그인도 가능, 로그인 시 @AuthUser 주입)
                    """
    )
    @GetMapping("/mine-first")
    ResponseEntity<ApiResponse<ReviewDto.ReviewsResponse>> getReviewsMineFirst(
            @Parameter(description = "상품 ID", required = true) @PathVariable Long productId,
            @Parameter(description = "인증 사용자 ID(SecurityContext에서 주입). 미로그인 시 null", required = false)
            @AuthUser(required = false) String userId,
            @ParameterObject Pageable pageable,
            @Parameter(description = "연령대 필터(선택)", required = false)
            @RequestParam(required = false) Integer ageGroup
    );

    /* 생성 (multipart/form-data) */
    @Operation(
            summary = "리뷰 생성 (multipart/form-data)",
            description = """
                    리뷰를 생성합니다. 본문은 반드시 multipart/form-data로 전송해야 합니다.
                    - review 파트: application/json (ReviewDto.Request)
                    - images 파트: 파일 배열(선택, 최대 5장)
                    - JWT의 sub(@AuthUser)과 DB의 NormalUser가 매칭되어야 하며,
                      사용자의 birthDate, address가 비어있으면 400을 반환합니다.
                    
                    권한: ROLE_NORMAL(본인)
                    """
    )
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @RequestBody(
            required = true,
            content = @Content(
                    mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                    schema = @Schema(implementation = ReviewCreateMultipartDoc.class),
                    encoding = {
                            // ★ Swagger-UI가 review 파트를 application/json으로 전송하도록 강제
                            @Encoding(name = "review", contentType = "application/json; charset=UTF-8"),
                            @Encoding(name = "images", contentType = "image/*")
                    }
            )
    )
    ResponseEntity<ApiResponse<ReviewDto.Response>> createReview(
            @Parameter(description = "상품 ID", required = true) @PathVariable Long productId,
            @Parameter(description = "인증 사용자 ID(SecurityContext에서 주입)", required = true)
            @AuthUser String userId,

            // --- multipart part #1: review(JSON) ---
            @Parameter(
                    name = "review",
                    required = true,
                    description = "리뷰 JSON 본문",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ReviewDto.Request.class),
                            examples = {
                                    @ExampleObject(
                                            name = "review",
                                            summary = "이미지 없이 등록 예시",
                                            value = """
                                                    {
                                                      "rating": 5,
                                                      "title": "핏 좋아요",
                                                      "comment": "원단도 괜찮고 배송 빨랐어요",
                                                      "purchaseSize": "M",
                                                      "purchaseColor": "BLACK"
                                                    }
                                                    """
                                    )
                            }
                    )
            )
            @Valid @RequestPart("review") ReviewDto.Request req,

            // --- multipart part #2: images(files[]) ---
            @Parameter(
                    name = "images",
                    description = "업로드 이미지들(선택, 최대 5장). 동일 key(images)로 여러 파일 전송",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE,
                            array = @ArraySchema(schema = @Schema(type = "string", format = "binary"))
                    )
            )
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    );

    /* 수정 */
    @Operation(
            summary = "리뷰 수정 (내용만)",
            description = """
                    리뷰의 제목/본문만 수정합니다.
                    권한: ROLE_SUPER (서비스 레이어에서 검증)
                    """
    )
    @PatchMapping("/{reviewId}")
    ResponseEntity<ApiResponse<Void>> updateReview(
            @Parameter(description = "리뷰 ID", required = true) @PathVariable Long reviewId,
            @Parameter(description = "리뷰 수정 본문(JSON)", required = true)
            @Valid @RequestBody ReviewDto.Request req
    );

    /* 삭제 */
    @Operation(
            summary = "리뷰 삭제",
            description = """
                    리뷰를 삭제합니다. 물리 파일도 함께 제거됩니다.
                    권한: ROLE_SUPER (서비스 레이어에서 검증)
                    """
    )
    @DeleteMapping("/{reviewId}")
    ResponseEntity<ApiResponse<Void>> deleteReview(
            @Parameter(description = "리뷰 ID", required = true) @PathVariable Long reviewId
    );

    /* 내가 작성한 모든 리뷰 */
    @Operation(
            summary = "내가 작성한 리뷰(모든 상품)",
            description = """
                    로그인 사용자가 작성한 모든 리뷰를 페이지로 조회합니다.
                    권한: ROLE_NORMAL(본인)
                    """
    )
    @GetMapping("/me/my")
    ResponseEntity<ApiResponse<Page<ReviewDto.Response>>> getMyReviews(
            @Parameter(description = "인증 사용자 ID(SecurityContext에서 주입)", required = true)
            @AuthUser String userId,
            @ParameterObject Pageable pageable
    );

    // ---- 문서 전용 DTO: Swagger-UI가 올바른 폼을 만들도록 도와주는 껍데기 ----
    @Schema(name = "ReviewCreateMultipart", description = "multipart/form-data로 리뷰 생성 시 전송 폼")
    class ReviewCreateMultipartDoc {
        @Schema(description = "리뷰 JSON 본문", requiredMode = Schema.RequiredMode.REQUIRED,
                implementation = ReviewDto.Request.class)
        public ReviewDto.Request review;

        @ArraySchema(arraySchema = @Schema(description = "업로드 이미지들(선택, 최대 5장)"),
                schema = @Schema(type = "string", format = "binary"))
        public List<MultipartFile> images;
    }
}
