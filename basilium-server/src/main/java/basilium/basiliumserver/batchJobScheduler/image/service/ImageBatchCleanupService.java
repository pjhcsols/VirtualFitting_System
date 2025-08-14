package basilium.basiliumserver.batchJobScheduler.image.service;

import basilium.basiliumserver.domain.review.entity.Review;
import basilium.basiliumserver.domain.review.repository.ReviewRepository;
import basilium.basiliumserver.domain.user.entity.SuperUser;
import basilium.basiliumserver.domain.user.repository.*;
import basilium.basiliumserver.properties.ImageProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.FileTime;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageBatchCleanupService {

    @Value("${image.cleanup.in-clause-chunk}")
    private int inClauseChunk;

    // 파일 생성/수정 후 이 시간(분) 이내 파일은 삭제 제외 (업로드 경합 안전장치)
    @Value("${image.cleanup.safety-age-minutes}")
    private long safetyAgeMinutes;

    private final NormalUserRepository normalUserRepository;
    private final BrandUserRepository brandUserRepository;
    private final SuperUserRepository superUserRepository;
    private final ReviewRepository reviewRepository;
    private final ImageProperties imageProperties;

    @PersistenceContext
    private EntityManager em;

    /* ===== 공통 유틸 ===== */

    private Set<String> safeListFilenames(String fullDir) {
        Path dir = Paths.get(fullDir);
        if (!Files.isDirectory(dir)) return Collections.emptySet();

        Instant safeBefore = Instant.now().minusSeconds(safetyAgeMinutes * 60);
        log.info("[FS] list dir={} (modifiedBefore={})", fullDir, safeBefore);

        try (Stream<Path> s = Files.list(dir)) {
            return s.filter(Files::isRegularFile)
                    .filter(p -> isOlderThan(p, safeBefore))
                    .map(p -> p.getFileName().toString())
                    .collect(Collectors.toCollection(TreeSet::new)); // 정렬된 Set
        } catch (IOException e) {
            log.error("디렉터리 조회 실패: {}", fullDir, e);
            return Collections.emptySet();
        }
    }

    private boolean isOlderThan(Path p, Instant threshold) {
        try {
            FileTime ft = Files.getLastModifiedTime(p);
            return ft.toInstant().isBefore(threshold);
        } catch (IOException e) {
            // 시간 조회 실패 시 보수적으로 삭제 대상에서 제외
            log.warn("파일 시간 조회 실패: {}", p, e);
            return false;
        }
    }

    private void deletePhysical(String fullDir, Set<String> fileNames) {
        int success = 0, fail = 0;
        Path base = Paths.get(fullDir);
        for (String fn : fileNames) {
            try {
                if (Files.deleteIfExists(base.resolve(fn))) success++;
            } catch (Exception e) {
                fail++;
                log.warn("파일 삭제 실패: {}/{}", fullDir, fn, e);
            }
        }
        log.info("물리 파일 삭제 결과 - 디렉터리={}, 성공={}, 실패={}", fullDir, success, fail);
    }

    private <T> List<Set<T>> chunk(Set<T> input, int size) {
        if (input == null || input.isEmpty()) return Collections.emptyList();
        List<T> list = new ArrayList<>(input);
        List<Set<T>> result = new ArrayList<>((list.size() + size - 1) / size);
        for (int i = 0; i < list.size(); i += size) {
            result.add(new LinkedHashSet<>(list.subList(i, Math.min(list.size(), i + size))));
        }
        return result;
    }

    private void logAll(String scope, String label, Collection<String> data) {
        List<String> sorted = (data == null)
                ? List.of()
                : data.stream().sorted().toList();
        log.info("[{}] {} (size={}): {}", scope, label, sorted.size(), sorted);
    }

    private Set<String> asSortedSet(Collection<String> c) {
        return (c == null) ? new TreeSet<>() : new TreeSet<>(c);
    }

    /* ===== 1) 일반 유저 이미지(userImageUrl) ===== */
    @Transactional
    public void cleanupUserImages() {
        final String SCOPE = "UserImage";
        log.info("[Batch] userImage 정리 시작");

        // 파일시스템
        Set<String> dir = safeListFilenames(imageProperties.getFullUploadDir());
        logAll(SCOPE, "DIR_SET(filesystem)", dir);

        // DB 원본 각각
        List<String> nu = normalUserRepository.getAllUserImageUrls();
        List<String> bu = brandUserRepository.getAllUserImageUrls();
        List<String> su = superUserRepository.getAllUserImageUrls();
        logAll(SCOPE, "DB_RAW_NormalUser", nu);
        logAll(SCOPE, "DB_RAW_BrandUser", bu);
        logAll(SCOPE, "DB_RAW_SuperUser", su);

        // 병합 SET
        Set<String> db = asSortedSet(nu);
        db.addAll(bu);
        db.addAll(su);
        logAll(SCOPE, "DB_MERGED_SET", db);

        // 디렉터리에만 있는 고아 파일 → 물리 삭제
        Set<String> orphans = dir.stream().filter(fn -> !db.contains(fn)).collect(Collectors.toCollection(TreeSet::new));
        logAll(SCOPE, "ORPHANS(to delete)", orphans);
        deletePhysical(imageProperties.getFullUploadDir(), orphans);

        // DB에만 남은 참조 → Bulk Update로 NULL 처리
        Set<String> dbOnly = db.stream().filter(fn -> !dir.contains(fn)).collect(Collectors.toCollection(TreeSet::new));
        logAll(SCOPE, "DB_ONLY(to null)", dbOnly);

        int cleared = 0;
        for (Set<String> part : chunk(dbOnly, inClauseChunk)) {
            cleared += normalUserRepository.clearUserImageUrlsIn(part);
            cleared += brandUserRepository.clearUserImageUrlsIn(part);
            cleared += superUserRepository.clearUserImageUrlsIn(part);
        }

        log.info("[Batch] userImage 정리 완료 (dir={}, db={}, delPhysical={}, clearedDbRefs={})",
                dir.size(), db.size(), orphans.size(), cleared);
    }

    /* ===== 2) 프로필 이미지(userProfileImageUrl) ===== */
    @Transactional
    public void cleanupProfileImages() {
        final String SCOPE = "ProfileImage";
        log.info("[Batch] profileImage 정리 시작");

        Set<String> dir = safeListFilenames(imageProperties.getFullProfileDir());
        logAll(SCOPE, "DIR_SET(filesystem)", dir);

        List<String> nu = normalUserRepository.getAllUserProfileUrls();
        List<String> bu = brandUserRepository.getAllUserProfileUrls();
        List<String> su = superUserRepository.getAllUserProfileUrls();
        logAll(SCOPE, "DB_RAW_NormalUser", nu);
        logAll(SCOPE, "DB_RAW_BrandUser", bu);
        logAll(SCOPE, "DB_RAW_SuperUser", su);

        Set<String> db = asSortedSet(nu);
        db.addAll(bu);
        db.addAll(su);
        logAll(SCOPE, "DB_MERGED_SET", db);

        Set<String> orphans = dir.stream().filter(fn -> !db.contains(fn)).collect(Collectors.toCollection(TreeSet::new));
        logAll(SCOPE, "ORPHANS(to delete)", orphans);
        deletePhysical(imageProperties.getFullProfileDir(), orphans);

        Set<String> dbOnly = db.stream().filter(fn -> !dir.contains(fn)).collect(Collectors.toCollection(TreeSet::new));
        logAll(SCOPE, "DB_ONLY(to null)", dbOnly);

        int cleared = 0;
        for (Set<String> part : chunk(dbOnly, inClauseChunk)) {
            cleared += normalUserRepository.clearUserProfileUrlsIn(part);
            cleared += brandUserRepository.clearUserProfileUrlsIn(part);
            cleared += superUserRepository.clearUserProfileUrlsIn(part);
        }

        log.info("[Batch] profileImage 정리 완료 (dir={}, db={}, delPhysical={}, clearedDbRefs={})",
                dir.size(), db.size(), orphans.size(), cleared);
    }

    /* ===== 3) 리뷰 이미지(review.imageUrls) ===== */
    @Transactional
    public void cleanupReviewImages() {
        final String SCOPE = "ReviewImage";
        log.info("[Batch] reviewImages 정리 시작");

        Set<String> dir = safeListFilenames(imageProperties.getFullReviewDir());
        logAll(SCOPE, "DIR_SET(filesystem)", dir);

        List<String> rv = reviewRepository.getAllReviewImageFileNames();
        logAll(SCOPE, "DB_RAW_ReviewImages", rv);

        Set<String> db = asSortedSet(rv);
        logAll(SCOPE, "DB_MERGED_SET", db);

        Set<String> orphans = dir.stream().filter(fn -> !db.contains(fn)).collect(Collectors.toCollection(TreeSet::new));
        logAll(SCOPE, "ORPHANS(to delete)", orphans);
        deletePhysical(imageProperties.getFullReviewDir(), orphans);

        Set<String> dbOnly = db.stream().filter(fn -> !dir.contains(fn)).collect(Collectors.toCollection(TreeSet::new));
        logAll(SCOPE, "DB_ONLY(to remove-ref)", dbOnly);

        int removedRefs = 0;
        for (Set<String> part : chunk(dbOnly, inClauseChunk)) {
            // N+1 방지: @EntityGraph로 imageUrls 함께 로딩
            List<Review> reviews = reviewRepository.findAllWithImagesIn(part);
            for (Review r : reviews) {
                List<String> imgs = r.getImageUrls();
                if (imgs != null && !imgs.isEmpty()) {
                    int before = imgs.size();
                    imgs.removeIf(part::contains);
                    removedRefs += (before - imgs.size());
                }
            }
            em.flush();
            em.clear();
        }

        log.info("[Batch] reviewImages 정리 완료 (dir={}, db={}, delPhysical={}, dbRemovedRefs={})",
                dir.size(), db.size(), orphans.size(), removedRefs);
    }

    /* ===== 4) 사업자등록증 ===== */
    @Transactional
    public void cleanupBusinessCertImages() {
        final String SCOPE = "BusinessCert";
        log.info("[Batch] businessCert 정리 시작");

        Set<String> dir = safeListFilenames(imageProperties.getFullBusinessRegDir());
        logAll(SCOPE, "DIR_SET(filesystem)", dir);

        List<String> buCerts = brandUserRepository.getAllBusinessCertFileNames();
        logAll(SCOPE, "DB_RAW_BusinessCert", buCerts);

        Set<String> db = asSortedSet(buCerts);
        logAll(SCOPE, "DB_MERGED_SET", db);

        Set<String> orphans = dir.stream().filter(fn -> !db.contains(fn)).collect(Collectors.toCollection(TreeSet::new));
        logAll(SCOPE, "ORPHANS(to delete)", orphans);
        deletePhysical(imageProperties.getFullBusinessRegDir(), orphans);

        Set<String> dbOnly = db.stream().filter(fn -> !dir.contains(fn)).collect(Collectors.toCollection(TreeSet::new));
        logAll(SCOPE, "DB_ONLY(to null)", dbOnly);

        int cleared = 0;
        for (Set<String> part : chunk(dbOnly, inClauseChunk)) {
            cleared += brandUserRepository.clearBusinessCertIn(part); // cert = null
        }

        log.info("[Batch] businessCert 정리 완료 (dir={}, db={}, delPhysical={}, clearedDbRefs={})",
                dir.size(), db.size(), orphans.size(), cleared);
    }

    /* ===== 5) 슈퍼 배너 ===== */
    @Transactional
    public void cleanupSuperBanners() {
        final String SCOPE = "SuperBanner";
        log.info("[Batch] superBanners 정리 시작");

        Set<String> dir = safeListFilenames(imageProperties.getFullSuperDir());
        logAll(SCOPE, "DIR_SET(filesystem)", dir);

        List<String> banners = superUserRepository.getAllBannerFileNames();
        logAll(SCOPE, "DB_RAW_Banners", banners);

        Set<String> db = asSortedSet(banners);
        logAll(SCOPE, "DB_MERGED_SET", db);

        Set<String> orphans = dir.stream().filter(fn -> !db.contains(fn)).collect(Collectors.toCollection(TreeSet::new));
        logAll(SCOPE, "ORPHANS(to delete)", orphans);
        deletePhysical(imageProperties.getFullSuperDir(), orphans);

        Set<String> dbOnly = db.stream().filter(fn -> !dir.contains(fn)).collect(Collectors.toCollection(TreeSet::new));
        logAll(SCOPE, "DB_ONLY(to remove-ref)", dbOnly);

        int removedRefs = 0;
        for (Set<String> part : chunk(dbOnly, inClauseChunk)) {
            List<SuperUser> targets = superUserRepository.findAllWithBannersIn(part);
            for (SuperUser su : targets) {
                List<String> list = su.getBannerImageFileUrls();
                if (list != null && !list.isEmpty()) {
                    int before = list.size();
                    list.removeIf(part::contains);
                    removedRefs += (before - list.size());
                }
            }
            em.flush();
            em.clear();
        }

        log.info("[Batch] superBanners 정리 완료 (dir={}, db={}, delPhysical={}, dbRemovedRefs={})",
                dir.size(), db.size(), orphans.size(), removedRefs);
    }
}
