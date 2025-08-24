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
import basilium.basiliumserver.global.review.MaskingUtil;
import basilium.basiliumserver.properties.ImageProperties;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    @PersistenceContext
    private EntityManager em;

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final NormalUserRepository userRepository;
    private final ImageProperties imageProperties;

    private static final int MAX_IMAGES = 5;
    private static final DateTimeFormatter TS_FMT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    /** rawAge → 10의 자리로 내림, 60 이상은 모두 60으로 묶기 */
    private int normalizeAgeGroup(int rawAge) {
        int decade = (rawAge / 10) * 10;
        return Math.min(decade, 60);
    }

    /** CSV 파일명 → 풀 URL 리스트로 변환 */
    private List<String> toFullUrlsFromCsv(String csv) {
        if (csv == null || csv.isBlank()) return Collections.emptyList();
        String base = imageProperties.getDomainReviewDir(); // e.g. https://basilium.co.kr/b1/images/userReviewImageStorage/
        String[] names = csv.split(",");
        List<String> urls = new ArrayList<>(names.length);
        for (String fn : names) {
            if (fn != null && !fn.isBlank()) {
                urls.add(base + fn.trim());
            }
        }
        return urls;
    }

    /** 파일 저장명: {role}_{userId}_{yyyyMMddHHmmss}_{index}.{ext} */
    private String buildReviewFileName(String role, String userId, String ts, int index1Based, String extNoDotLower) {
        return String.format("%s_%s_%s_%d.%s", role, userId, ts, index1Based, extNoDotLower);
    }

    private String extractExtNoDotLower(String originalFilename) {
        if (originalFilename == null) return "";
        int dot = originalFilename.lastIndexOf('.');
        if (dot < 0 || dot == originalFilename.length() - 1) return "";
        return originalFilename.substring(dot + 1).toLowerCase(Locale.ROOT);
    }

    // ---------------------------
    // 조회: 기본(최신순) — 항상 풀 URL 반환
    // ---------------------------
    public ReviewDto.ReviewsResponse getReviews(Long productId, Pageable pageable, Integer rawAge) {
        double avgRating = reviewRepository.findAverageRatingByProductId(productId);
        Integer ageGroup = (rawAge == null ? null : normalizeAgeGroup(rawAge));

        Page<ReviewDto.Response> page = reviewRepository
                .fetchReviewDtos(productId, ageGroup, pageable)
                .map(p -> new ReviewDto.Response(
                        p.getReviewId(),
                        MaskingUtil.maskUserIdSuffix(p.getMaskedUserId()), // 뒤 3글자 마스킹
                        p.getPurchaseSize(),
                        p.getPurchaseColor(),
                        p.getRating(),
                        p.getTitle(),
                        p.getComment(),
                        toFullUrlsFromCsv(p.getReviewImageUrls()),
                        p.getCreatedAt(),
                        p.getUpdatedAt()
                ));

        return new ReviewDto.ReviewsResponse(avgRating, page);
    }

    // ---------------------------------------------------------
    // 조회(추가): 특정 상품 — 내 리뷰 먼저 + 나머지 최신순
    // ---------------------------------------------------------
    public ReviewDto.ReviewsResponse getReviewsMineFirst(Long productId, String userId, Pageable pageable, Integer rawAge) {
        double avgRating = reviewRepository.findAverageRatingByProductId(productId);
        Integer ageGroup = (rawAge == null ? null : normalizeAgeGroup(rawAge));

        Page<ReviewDto.Response> page = (userId == null || userId.isBlank())
                ? reviewRepository.fetchReviewDtos(productId, ageGroup, pageable)
                .map(p -> new ReviewDto.Response(
                        p.getReviewId(),
                        MaskingUtil.maskUserIdSuffix(p.getMaskedUserId()),
                        p.getPurchaseSize(),
                        p.getPurchaseColor(),
                        p.getRating(),
                        p.getTitle(),
                        p.getComment(),
                        toFullUrlsFromCsv(p.getReviewImageUrls()),
                        p.getCreatedAt(),
                        p.getUpdatedAt()
                ))
                : reviewRepository.fetchReviewDtosMineFirst(productId, userId, ageGroup, pageable)
                .map(p -> new ReviewDto.Response(
                        p.getReviewId(),
                        MaskingUtil.maskUserIdSuffix(p.getMaskedUserId()),
                        p.getPurchaseSize(),
                        p.getPurchaseColor(),
                        p.getRating(),
                        p.getTitle(),
                        p.getComment(),
                        toFullUrlsFromCsv(p.getReviewImageUrls()),
                        p.getCreatedAt(),
                        p.getUpdatedAt()
                ));

        return new ReviewDto.ReviewsResponse(avgRating, page);
    }

    // -----------------------------------------
    // 조회(추가): 내가 쓴 리뷰 (상품 전체)
    // -----------------------------------------
    public Page<ReviewDto.Response> getMyReviewsAllProducts(String userId, Pageable pageable) {
        return reviewRepository.fetchMyReviewDtos(userId, pageable)
                .map(p -> new ReviewDto.Response(
                        p.getReviewId(),
                        MaskingUtil.maskUserIdSuffix(p.getMaskedUserId()),
                        p.getPurchaseSize(),
                        p.getPurchaseColor(),
                        p.getRating(),
                        p.getTitle(),
                        p.getComment(),
                        toFullUrlsFromCsv(p.getReviewImageUrls()),
                        p.getCreatedAt(),
                        p.getUpdatedAt()
                ));
    }

    // ---------------------------
    // 생성: 파일명만 DB 저장, 응답은 풀 URL
    // ---------------------------
    @Transactional
    public ReviewDto.Response createReview(Long productId, String userId, ReviewDto.Request req, List<MultipartFile> images) {
        List<MultipartFile> files = Optional.ofNullable(images).orElseGet(Collections::emptyList);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "상품이 없습니다: " + productId));
        NormalUser user = userRepository.findById(userId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.MEMBER_NOT_FOUND, "유저가 없습니다: " + userId));

        Optional.ofNullable(user.getBirthDate())
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.INVALID_INPUT_VALUE, "생년월일 누락"));
        Optional.ofNullable(user.getAddress())
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.INVALID_INPUT_VALUE, "주소 누락"));

        if (files.size() > MAX_IMAGES) {
            throw new BasiliumCustomException(ErrorCode.INVALID_INPUT_VALUE, "이미지는 최대 5장까지");
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
        String role = "normal"; // 일반 유저
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            String ext = extractExtNoDotLower(file.getOriginalFilename());
            String filename = buildReviewFileName(role, userId, ts, i + 1, ext); // 파일명만

            File dest = new File(imageProperties.getFullReviewDir() + filename);
            try {
                File parent = dest.getParentFile();
                if (parent != null) parent.mkdirs();
                file.transferTo(dest);
            } catch (IOException e) {
                log.error("이미지 저장 실패 {}", filename, e);
                throw new BasiliumCustomException(ErrorCode.SERVER_ERROR, "이미지 저장 실패: " + filename);
            }

            review.addReviewImageUrl(filename); // DB에는 파일명만
        }

        em.persist(review);

        // 응답: 풀 URL 변환
        String base = imageProperties.getDomainReviewDir();
        List<String> urls = review.getReviewImageUrls().stream().map(fn -> base + fn).toList();

        return new ReviewDto.Response(
                review.getReviewId(),
                MaskingUtil.maskUserIdSuffix(userId),
                review.getPurchaseSize(),
                review.getPurchaseColor(),
                review.getRating(),
                review.getTitle(),
                review.getComment(),
                urls,
                review.getCreatedAt(),
                review.getUpdatedAt()
        );
    }

    // ---------------------------
    // 수정
    // ---------------------------
    @Transactional
    public void updateReview(Long reviewId, ReviewDto.Request req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isSuper = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPER"));
        if (!isSuper) {
            throw new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "슈퍼유저만 수정할 수 있습니다.");
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "수정할 리뷰를 찾을 수 없습니다: " + reviewId));

        review.updateContent(req.getTitle(), req.getComment());
    }

    // ---------------------------
    // 삭제: 파일명 기준 물리 삭제 + 엔티티 제거
    // ---------------------------
    @Transactional
    public void deleteReview(Long reviewId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isSuper = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPER"));
        if (!isSuper) {
            throw new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "슈퍼유저만 삭제할 수 있습니다.");
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "삭제할 리뷰를 찾을 수 없습니다: " + reviewId));

        review.getReviewImageUrls().forEach(fileName -> {
            File file = new File(imageProperties.getFullReviewDir() + fileName);
            if (file.exists() && !file.delete()) {
                log.warn("이미지 삭제 실패 {}", file.getAbsolutePath());
            }
        });

        reviewRepository.delete(review);
    }
}
