// 4. ReviewService.java
package basilium.basiliumserver.domain.review.service;

import basilium.basiliumserver.domain.product.entity.Product;
import basilium.basiliumserver.domain.product.repository.ProductRepository;
import basilium.basiliumserver.domain.review.dto.ReviewDto;
import basilium.basiliumserver.domain.review.entity.Review;
import basilium.basiliumserver.domain.review.repository.ReviewRepository;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import basilium.basiliumserver.domain.user.repository.NormalUserRepository;

import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import basilium.basiliumserver.global.util.MaskingUtil;
import basilium.basiliumserver.properties.ImageProperties;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    @PersistenceContext
    private EntityManager em;
    private final ReviewRepository     reviewRepository;
    private final ProductRepository    productRepository;
    private final NormalUserRepository userRepository;
    private final ImageProperties      imageProperties;

    private static final int MAX_IMAGES          = 5;
    private static final DateTimeFormatter TS_FMT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    /** rawAge → 10의 자리로 내림, 60 이상은 모두 60으로 묶기 */
    private int normalizeAgeGroup(int rawAge) {
        int decade = (rawAge / 10) * 10;
        return Math.min(decade, 60);
    }

    public ReviewDto.ReviewsResponse getReviews(
            Long productId,
            Pageable pageable,
            Integer rawAge
    ) {
        // 1) 평균 평점 계산
        double avgRating = reviewRepository.findAverageRatingByProductId(productId);

        // 2) rawAge → ageGroup 정규화
        Integer ageGroup = (rawAge == null ? null : normalizeAgeGroup(rawAge));

        // 3) 리뷰 조회 및 DTO 매핑
        Page<ReviewDto.Response> page = reviewRepository
                .fetchReviewDtos(productId, ageGroup, pageable)
                .map(p -> {
                    List<String> urls = Optional.ofNullable(p.getImageUrls())
                            .map(s -> List.of(s.split(",")))
                            .orElseGet(Collections::emptyList);

                    return new ReviewDto.Response(
                            p.getReviewId(),
                            MaskingUtil.maskUserIdSuffix(p.getMaskedUserId()),
                            p.getPurchaseSize(),
                            p.getPurchaseColor(),
                            p.getRating(),
                            p.getTitle(),
                            p.getComment(),
                            urls,
                            p.getCreatedAt(),
                            p.getUpdatedAt()
                    );
                });

        return new ReviewDto.ReviewsResponse(avgRating, page);
    }


    /*
    public ReviewDto.ReviewsResponse getReviews(
            Long productId,
            Pageable pageable,
            Integer ageGroup
    ) {
        // 1) 평균 평점 계산 (한 번만)
        double avgRating = reviewRepository.findAverageRatingByProductId(productId);

        // 2) 리뷰 페이징 조회 (projection → DTO 매핑)
        Page<ReviewDto.Response> page = reviewRepository.fetchReviewDtos(productId, pageable)
                .map(p -> {
                    List<String> urls = Optional.ofNullable(p.getImageUrls())
                            .map(s -> List.of(s.split(",")))
                            .orElseGet(Collections::emptyList);

                    return new ReviewDto.Response(
                            p.getReviewId(),
                            MaskingUtil.maskUserId(p.getMaskedUserId()),
                            p.getPurchaseSize(),
                            p.getPurchaseColor(),
                            p.getRating(),
                            p.getTitle(),
                            p.getComment(),
                            urls,
                            p.getCreatedAt(),
                            p.getUpdatedAt()               // projection에도 updatedAt 추가 필요
                    );
                });

        return new ReviewDto.ReviewsResponse(avgRating, page);
    }

     */

    @Transactional
    public ReviewDto.Response createReview(
            Long productId,
            String userId,
            ReviewDto.Request req,
            List<MultipartFile> images
    ) {
        List<MultipartFile> files = Optional.ofNullable(images)
                .orElseGet(Collections::emptyList);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "상품이 없습니다: " + productId));
        NormalUser user = userRepository.findById(userId)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.MEMBER_NOT_FOUND,
                        "유저가 없습니다: " + userId));

        Optional.ofNullable(user.getBirthDate())
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.INVALID_INPUT_VALUE,
                        "생년월일 누락"));
        Optional.ofNullable(user.getAddress())
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.INVALID_INPUT_VALUE,
                        "주소 누락"));

        if (files.size() > MAX_IMAGES) {
            throw new BasiliumCustomException(
                    ErrorCode.INVALID_INPUT_VALUE,
                    "이미지는 최대 5장까지");
        }

        Review review = Review.builder()
                .product(product)
                .user(user)
                .purchaseSize(req.getPurchaseSize())
                .purchaseColor(req.getPurchaseColor())
                .rating(req.getRating())
                .title(req.getTitle())
                .comment(req.getComment())
                .build();

        String ts = LocalDateTime.now().format(TS_FMT);
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            String ext = Optional.ofNullable(file.getOriginalFilename())
                    .filter(n -> n.contains("."))
                    .map(n -> n.substring(n.lastIndexOf('.')))
                    .orElse("");
            String filename = String.format("%s_%s_%d%s", userId, ts, i+1, ext);
            File dest = new File(imageProperties.getFullReviewDir() + filename);
            try {
                file.transferTo(dest);
            } catch (IOException e) {
                log.error("이미지 저장 실패 {}", filename, e);
                throw new BasiliumCustomException(
                        ErrorCode.SERVER_ERROR,
                        "이미지 저장 실패: " + filename);
            }
            review.addImageUrl(imageProperties.getFullReviewDir() + filename);
        }

        //Review saved = reviewRepository.save(review);
        em.persist(review);

        return new ReviewDto.Response(
                review.getReviewId(),
                MaskingUtil.maskUserIdSuffix(userId),
                review.getPurchaseSize(),
                review.getPurchaseColor(),
                review.getRating(),
                review.getTitle(),
                review.getComment(),
                review.getImageUrls(),
                review.getCreatedAt(),
                review.getUpdatedAt()
        );
    }

    @Transactional
    public void updateReview(
            Long reviewId,
            ReviewDto.Request req
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isSuper = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER"));
        if (!isSuper) {
            throw new BasiliumCustomException(
                    ErrorCode.ACCESS_DENIED,
                    "슈퍼유저만 수정할 수 있습니다."
            );
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "수정할 리뷰를 찾을 수 없습니다: " + reviewId
                ));
        review.updateContent(req.getTitle(), req.getComment());
    }

    // ReviewService.java (삭제 시 리뷰 이미지 파일도 함께 삭제)
    @Transactional
    public void deleteReview(Long reviewId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isSuper = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER"));
        if (!isSuper) {
            throw new BasiliumCustomException(
                    ErrorCode.ACCESS_DENIED,
                    "슈퍼유저만 삭제할 수 있습니다."
            );
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "삭제할 리뷰를 찾을 수 없습니다: " + reviewId
                ));

        // 1) 파일 삭제
        review.getImageUrls().forEach(url -> {
            String filename = url.substring(url.lastIndexOf('/') + 1);
            File file = new File(imageProperties.getFullReviewDir() + filename);
            if (file.exists() && !file.delete()) {
                log.warn("이미지 삭제 실패 {}", file.getAbsolutePath());
            }
        });

        // 2) ElementCollection도 함께 삭제됨
        reviewRepository.delete(review);
    }
}
