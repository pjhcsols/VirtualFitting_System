// src/main/java/basilium/basiliumserver/domain/user/service/SuperUserService.java
package basilium.basiliumserver.domain.user.service;

import basilium.basiliumserver.domain.user.dto.MyBannerDto;
import basilium.basiliumserver.domain.user.entity.JoinStatus;
import basilium.basiliumserver.domain.user.entity.Provider;
import basilium.basiliumserver.domain.user.entity.SuperUser;
import basilium.basiliumserver.domain.user.repository.SuperUserRepository;
import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import basilium.basiliumserver.global.image.FileStorageService;
import basilium.basiliumserver.properties.ImageProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SuperUserService {

    private final SuperUserRepository superUserRepository;
    private final FileStorageService storage;
    private final ImageProperties imageProperties;

    /** 반드시 ROLE_SUPER인지 확인 */
    private void ensureSuper() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isSuper = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + Provider.SUPER.name()));
        if (!isSuper) {
            throw new BasiliumCustomException(
                    ErrorCode.ACCESS_DENIED,
                    "슈퍼유저만 가능합니다."
            );
        }
    }

    /** 전체 슈퍼유저 조회 (페이징/정렬) */
    public Page<SuperUser> getAllSuperUsers(Pageable pageable) {
        return superUserRepository.findAll(pageable);
    }

    /** 프로필 수정 */
    @Transactional
    public void modifyProfile(String userId, SuperUser updated) {
        ensureSuper();
        SuperUser existing = superUserRepository.findById(userId)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "수정할 슈퍼유저가 없습니다: " + userId
                ));
        existing.updateProfile(
                updated.getName(),
                updated.getPosition(),
                updated.getDepartment(),
                updated.getJobRole()
        );
    }

    /** 회원가입(Grade·Provider는 @PrePersist에서 자동 설정) */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public JoinStatus join(SuperUser candidate) {
        if (superUserRepository.findById(candidate.getId()).isPresent()) {
            return JoinStatus.DUPLICATE;
        }
        superUserRepository.save(candidate);
        return JoinStatus.SUCCESS;
    }

    @Transactional
    public String updateBanner(String userId,
                               MultipartFile file,
                               Optional<String> oldFileNameOpt) {
        ensureSuper();

        SuperUser u = superUserRepository.findById(userId)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.MEMBER_NOT_FOUND, "슈퍼유저가 없습니다: " + userId
                ));

        // 용량 검사
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BasiliumCustomException(
                    ErrorCode.BAD_REQUEST, "파일 크기는 5MB 이하입니다."
            );
        }

        List<String> banners = u.getBannerImageFileUrls();

        String fn;
        if (oldFileNameOpt.filter(banners::contains).isPresent()) {
            // ── 교체(branch 1) ──
            String old = oldFileNameOpt.get();
            // 1) DB 반영: 기존 배너 리스트에서 교체
            int idx = banners.indexOf(old);
            banners.set(idx, "");          // 자리 확보용 빈 문자열
            // 2) 파일 삭제
            storage.delete(imageProperties.getFullSuperDir(), old);
            // 3) 파일 저장
            fn = storage.store(file,
                    imageProperties.getFullSuperDir(),
                    Provider.SUPER.getProviderName(), userId);
            // 4) DB 반영: 새 파일명 삽입
            banners.set(idx, fn);

        } else {
            // ── 신규 추가(branch 2) ──
            if (banners.size() >= 10) {
                throw new BasiliumCustomException(
                        ErrorCode.BAD_REQUEST, "최대 10장의 배너만 등록 가능합니다."
                );
            }
            // 1) 파일 저장
            fn = storage.store(file,
                    imageProperties.getFullSuperDir(),
                    Provider.SUPER.getProviderName(), userId);
            // 2) DB 반영: 리스트에 추가
            banners.add(fn);
        }

        return fn;
    }


    /** 일괄 배너 교체 (최대 10장) */
    @Transactional
    public List<MyBannerDto> replaceAllBanners(String userId,
                                               List<MultipartFile> files) {
        ensureSuper();

        if (files == null || files.isEmpty()) {
            return Collections.emptyList();
        }
        if (files.size() > 10) {
            throw new BasiliumCustomException(
                    ErrorCode.BAD_REQUEST,
                    "최대 10장의 배너만 등록 가능합니다."
            );
        }

        SuperUser u = superUserRepository.findById(userId)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.MEMBER_NOT_FOUND,
                        "슈퍼유저가 없습니다: " + userId
                ));

        // 1) 기존 전부 삭제
        u.getBannerImageFileUrls().forEach(fn ->
                storage.delete(imageProperties.getFullSuperDir(), fn)
        );
        u.getBannerImageFileUrls().clear();

        // 2) 새로 업로드 + DTO 생성
        List<MyBannerDto> dtos = files.stream()
                .peek(f -> {
                    if (f.getSize() > 5 * 1024 * 1024) {
                        throw new BasiliumCustomException(
                                ErrorCode.BAD_REQUEST,
                                "파일 크기는 5MB 이하입니다."
                        );
                    }
                })
                .map(f -> {
                    String fn = storage.store(
                            f,
                            imageProperties.getFullSuperDir(),
                            Provider.SUPER.getProviderName(),
                            userId
                    );
                    u.addBanner(fn);
                    return new MyBannerDto(
                            u.getUserNumber(),
                            fn,
                            imageProperties.getDomainSuperDir() + fn
                    );
                })
                .collect(Collectors.toList());

        return Collections.unmodifiableList(dtos);
    }

    /** 내 배너 리스트 조회 */
    @Transactional(readOnly = true)
    public List<MyBannerDto> listMyBanners(String userId) {
        SuperUser u = superUserRepository.findById(userId)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.MEMBER_NOT_FOUND,
                        "슈퍼유저가 없습니다: " + userId
                ));

        var files = u.getBannerImageFileUrls();
        if (files.isEmpty()) {
            return Collections.emptyList();
        }

        List<MyBannerDto> dtos = files.stream()
                .map(fn -> new MyBannerDto(
                        u.getUserNumber(),
                        fn,
                        imageProperties.getDomainSuperDir() + fn
                ))
                .collect(Collectors.toList());

        return Collections.unmodifiableList(dtos);
    }

    /** 단일 배너 삭제 */
    @Transactional
    public void deleteBanner(String userId, String fileName) {
        ensureSuper();
        SuperUser u = superUserRepository.findById(userId)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.MEMBER_NOT_FOUND,
                        "슈퍼유저가 없습니다: " + userId
                ));

        if (!u.getBannerImageFileUrls().contains(fileName)) {
            throw new BasiliumCustomException(
                    ErrorCode.RESOURCE_NOT_FOUND,
                    "삭제할 배너가 없습니다: " + fileName
            );
        }

        storage.delete(imageProperties.getFullSuperDir(), fileName);
        u.removeBanner(fileName);
    }
}
