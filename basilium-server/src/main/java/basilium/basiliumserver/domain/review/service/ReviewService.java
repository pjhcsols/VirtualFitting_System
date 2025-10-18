package basilium.basiliumserver.domain.review.service;

import basilium.basiliumserver.domain.order.entity.Order;
import basilium.basiliumserver.domain.order.entity.OrderStatus;
import basilium.basiliumserver.domain.order.repository.OrderRepository;
import basilium.basiliumserver.domain.payment.entity.Payment;
import basilium.basiliumserver.domain.payment.repository.PaymentRepository;
import basilium.basiliumserver.domain.product.entity.Product;
import basilium.basiliumserver.domain.product.repository.ProductRepository;
import basilium.basiliumserver.domain.review.dto.ReviewDto;
import basilium.basiliumserver.domain.review.entity.Review;
import basilium.basiliumserver.domain.review.repository.ReviewRepository;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import basilium.basiliumserver.domain.user.repository.NormalUserRepository;
import basilium.basiliumserver.domain.wallet.service.WalletService;
import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import basilium.basiliumserver.global.image.FileStorageService;
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
    private final FileStorageService fileStorageService;
    private final WalletService walletService;

    // ✅ [추가] 검증용
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    private static final int MAX_IMAGES = 5;
    private static final DateTimeFormatter TS_FMT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    /** rawAge → 10의 자리로 내림, 60 이상은 모두 60으로 묶기 */
    private int normalizeAgeGroup(int rawAge) {
        int decade = (rawAge / 10) * 10;
        return Math.min(decade, 60);
    }

    // [교체] CSV → URL 변환 시 도메인 스킴 자동 보정
    // 기존 메서드 전체 교체
    private List<String> toFullUrlsFromCsv(String csv) {
        if (csv == null || csv.isBlank()) return Collections.emptyList();
        String base = imageProperties.getDomainReviewDir(); // ex) basilium.co.kr/b1/images/userReviewImageStorage/
        String[] names = csv.split(",");
        List<String> urls = new ArrayList<>(names.length);
        for (String fn : names) {
            if (fn != null && !fn.isBlank()) urls.add(base + fn.trim());
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
    // [교체] 리뷰 생성: FileStorageService 사용 & 리뷰작성 즉시 지갑 10% 적립(멱등)
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

        if (files.size() > MAX_IMAGES) throw new BasiliumCustomException(ErrorCode.INVALID_INPUT_VALUE, "이미지는 최대 5장까지");


        Long paymentId = req.getPaymentId();
        if (paymentId == null) {
            throw new BasiliumCustomException(ErrorCode.INVALID_INPUT_VALUE, "paymentId가 필요합니다(주문 매핑)");
        }

        Payment pay = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "결제를 찾을 수 없습니다: " + paymentId));

        // 본인 결제인지 (NormalUser.id/number 체계에 맞게 비교)
        if (!Objects.equals(pay.getNormalUser().getId(), userId)) {
            throw new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "본인 결제가 아닙니다.");
        }

        String orderId = pay.getOrderId();
        Order order = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "주문을 찾을 수 없습니다: " + orderId));

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new BasiliumCustomException(ErrorCode.CONFLICT, "배송완료 상태에서만 리뷰 작성 가능합니다.");
        }
        if (order.getDeliveredAt() == null || order.getDeliveredAt().isBefore(LocalDateTime.now().minusDays(14))) {
            throw new BasiliumCustomException(ErrorCode.CONFLICT, "배송완료 후 14일 이내에만 리뷰 작성 가능합니다.");
        }

        // 주문당 1회 제한: 주문에 포함된 상품 중 이미 내가 쓴 리뷰가 하나라도 있으면 차단
        boolean already = reviewRepository.existsAnyByUserAndOrderProducts(user.getUserNumber(), orderId);
        if (already) {
            throw new BasiliumCustomException(ErrorCode.CONFLICT, "해당 주문에 대한 리뷰는 이미 작성되었습니다(주문당 1회).");
        }

        // [추가] 리뷰 적립(10%) — 결제 라인 필수일 때만 시도 (멱등키: REVIEW:{paymentId})
        if (paymentId != null) {
            // 내부에서 본인 결제/APPROVED 검증 & 멱등 처리됨 (실패 시 예외)
            walletService.creditByReview(userId, paymentId);
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

        // [변경] 물리 저장: FileStorageService.storeIndexed 사용, DB에는 파일명만 저장
        String ts = LocalDateTime.now().format(TS_FMT);
        String role = "normal";
        String fullDir = imageProperties.getFullReviewDir();

        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            String filename = fileStorageService.storeIndexed(file, fullDir, role, userId, ts, i + 1);
            review.addReviewImageUrl(filename);
        }

        em.persist(review);

        // 응답 URL 조립(스킴 보정 포함)
        String base = imageProperties.getDomainReviewDir();
        List<String> urls = review.getReviewImageUrls().stream()
                .map(fn -> base + fn)
                .toList();

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
    // [교체] 삭제: FileStorageService.delete 사용
    @Transactional
    public void deleteReview(Long reviewId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isSuper = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPER"));
        if (!isSuper) throw new BasiliumCustomException(ErrorCode.ACCESS_DENIED, "슈퍼유저만 삭제할 수 있습니다.");

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new BasiliumCustomException(ErrorCode.RESOURCE_NOT_FOUND, "삭제할 리뷰를 찾을 수 없습니다: " + reviewId));

        String fullDir = imageProperties.getFullReviewDir();
        review.getReviewImageUrls().forEach(fileName -> fileStorageService.delete(fullDir, fileName));

        reviewRepository.delete(review);
    }
}
