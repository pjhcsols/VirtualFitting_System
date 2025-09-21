// src/main/java/basilium/basiliumserver/domain/user/service/SuperUserService.java
package basilium.basiliumserver.domain.user.service;

import basilium.basiliumserver.domain.user.dto.MyBannerDto;
import basilium.basiliumserver.domain.user.dto.SuperUserDto;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SuperUserService {

    private final SuperUserRepository superUserRepository;
    private final FileStorageService storage;
    private final ImageProperties imageProperties;
    private final PasswordEncoder passwordEncoder;

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

    /** 회원가입(Grade·Provider는 @PrePersist에서 자동 설정) */
    /** 회원가입: 중복검증 → 비번해시 → 생성자 저장 (배너는 가입 시 무시) */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void signUp(SuperUserDto.Signup dto) {
        final String loginId = dto.getId().trim();
        final String email   = dto.getEmailAddress().trim().toLowerCase();
        final String phone   = dto.getPhoneNumber().trim();
        final String hashed  = passwordEncoder.encode(dto.getPassword().trim());

        if (superUserRepository.existsByIdIs(loginId))
            throw new BasiliumCustomException(ErrorCode.DUPLICATE_RESOURCE, "이미 사용 중인 아이디입니다.");
        if (superUserRepository.existsByEmailAddress(email))
            throw new BasiliumCustomException(ErrorCode.DUPLICATE_RESOURCE, "이미 사용 중인 이메일입니다.");
        if (superUserRepository.existsByPhoneNumber(phone))
            throw new BasiliumCustomException(ErrorCode.DUPLICATE_RESOURCE, "이미 사용 중인 전화번호입니다.");

        SuperUser su = new SuperUser(
                loginId, hashed, email, phone,
                dto.getName(), dto.getPosition(), dto.getDepartment(), dto.getJobRole()
        );
        superUserRepository.save(su);
    }


    /** 프로필 수정 */
    @Transactional
    public void modifyProfile(String currentLoginId, SuperUserDto.UpdateProfile dto) {
        ensureSuper();

        final String NF_MSG = "수정할 슈퍼유저가 없습니다: "; // 메시지 상수화(중복 제거)

        // 배너 컬렉션까지 필요하면 @EntityGraph 메서드 사용 가능
        SuperUser existing = superUserRepository.findById(currentLoginId)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.RESOURCE_NOT_FOUND, NF_MSG + currentLoginId
                ));

        // 1) 변경 의도 있는 값에 한정하여 중복 대조
        Optional.ofNullable(dto.getId())
                .map(String::trim)
                .filter(newId -> !newId.equals(existing.getId()))
                .filter(superUserRepository::existsByIdIs)
                .ifPresent(x -> { throw new BasiliumCustomException(
                        ErrorCode.DUPLICATE_RESOURCE, "이미 사용 중인 아이디입니다."); });

        Optional.ofNullable(dto.getEmailAddress())
                .map(s -> s.trim().toLowerCase())
                .filter(newEmail -> !newEmail.equals(existing.getEmailAddress()))
                .filter(superUserRepository::existsByEmailAddress)
                .ifPresent(x -> { throw new BasiliumCustomException(
                        ErrorCode.DUPLICATE_RESOURCE, "이미 사용 중인 이메일입니다."); });

        Optional.ofNullable(dto.getPhoneNumber())
                .map(String::trim)
                .filter(newPhone -> !newPhone.equals(existing.getPhoneNumber()))
                .filter(superUserRepository::existsByPhoneNumber)
                .ifPresent(x -> { throw new BasiliumCustomException(
                        ErrorCode.DUPLICATE_RESOURCE, "이미 사용 중인 전화번호입니다."); });

        // 2) 인라인 계산 + 단발 도메인 메서드 호출(@DynamicUpdate로 변경 칼럼만 UPDATE)
        existing.updateAll(
                Optional.ofNullable(dto.getId()).map(String::trim).orElse(existing.getId()),
                Optional.ofNullable(dto.getPassword())
                        .map(String::trim)
                        .filter(pw -> !pw.isEmpty())
                        .map(passwordEncoder::encode)
                        .orElse(existing.getPassword()),
                Optional.ofNullable(dto.getEmailAddress()).map(s -> s.trim().toLowerCase()).orElse(existing.getEmailAddress()),
                Optional.ofNullable(dto.getPhoneNumber()).map(String::trim).orElse(existing.getPhoneNumber()),
                Optional.ofNullable(dto.getName()).orElse(existing.getName()),
                Optional.ofNullable(dto.getPosition()).orElse(existing.getPosition()),
                Optional.ofNullable(dto.getDepartment()).orElse(existing.getDepartment()),
                Optional.ofNullable(dto.getJobRole()).orElse(existing.getJobRole())
        );
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

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BasiliumCustomException(
                    ErrorCode.BAD_REQUEST, "파일 크기는 5MB 이하입니다."
            );
        }

        List<String> banners = u.getBannerImageFileUrls();
        String role = Provider.SUPER.getProviderName();
        String dir  = imageProperties.getFullSuperDir();
        String ts   = java.time.LocalDateTime.now()
                .format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        String fn;
        if (oldFileNameOpt.filter(banners::contains).isPresent()) {
            // 교체: 새 파일 저장 → 리스트 교체 → 기존 파일 삭제
            int idx = banners.indexOf(oldFileNameOpt.get());
            String newName = storage.storeIndexed(file, dir, role, userId, ts, idx + 1);
            String old     = banners.get(idx);

            banners.set(idx, newName);
            storage.delete(dir, old);

            fn = newName;
        } else {
            // 추가
            if (banners.size() >= 10) {
                throw new BasiliumCustomException(
                        ErrorCode.BAD_REQUEST, "최대 10장의 배너만 등록 가능합니다."
                );
            }
            int nextIndex = banners.size() + 1;
            fn = storage.storeIndexed(file, dir, role, userId, ts, nextIndex);
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
            return java.util.Collections.emptyList();
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

        String role = Provider.SUPER.getProviderName();
        String dir  = imageProperties.getFullSuperDir();
        String ts   = java.time.LocalDateTime.now()
                .format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        // 1) 새 파일들 먼저 저장 (안전)
        java.util.List<String> newNames = new java.util.ArrayList<>(files.size());
        for (int i = 0; i < files.size(); i++) {
            MultipartFile f = files.get(i);
            if (f.getSize() > 5 * 1024 * 1024) {
                throw new BasiliumCustomException(
                        ErrorCode.BAD_REQUEST,
                        "파일 크기는 5MB 이하입니다."
                );
            }
            String name = storage.storeIndexed(f, dir, role, userId, ts, i + 1);
            newNames.add(name);
        }

        // 2) 기존 파일 삭제는 저장 성공 후
        java.util.List<String> oldFiles = java.util.List.copyOf(u.getBannerImageFileUrls());
        u.getBannerImageFileUrls().clear();
        u.getBannerImageFileUrls().addAll(newNames);
        oldFiles.forEach(old -> storage.delete(dir, old));

        // 3) 응답 DTO
        return newNames.stream()
                .map(fn -> new MyBannerDto(u.getUserNumber(), fn, imageProperties.getDomainSuperDir() + fn))
                .toList();
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

        return files.stream()
                .map(fn -> new MyBannerDto(u.getUserNumber(), fn, imageProperties.getDomainSuperDir() + fn))
                .toList();
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
