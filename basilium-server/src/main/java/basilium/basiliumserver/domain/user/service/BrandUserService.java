// src/main/java/basilium/basiliumserver/domain/user/service/BrandUserService.java
package basilium.basiliumserver.domain.user.service;

import basilium.basiliumserver.domain.user.dto.MyBusinessCertDto;
import basilium.basiliumserver.domain.user.entity.BrandUser;
import basilium.basiliumserver.domain.user.entity.JoinStatus;
import basilium.basiliumserver.domain.user.entity.Provider;
import basilium.basiliumserver.domain.user.repository.BrandUserRepository;
import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import basilium.basiliumserver.global.image.FileStorageService;
import basilium.basiliumserver.properties.ImageProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class BrandUserService {

    private final BrandUserRepository brandUserRepository;
    private final FileStorageService storage;
    private final ImageProperties imageProperties;

    /** ROLE_BRAND 여부 검증 */
    private void ensureBrand() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isBrand = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + Provider.BRAND.name()));
        if (!isBrand) {
            throw new BasiliumCustomException(
                    ErrorCode.ACCESS_DENIED,
                    "브랜드 유저만 접근할 수 있습니다."
            );
        }
    }

    /** ROLE_SUPER 여부 검증 */
    private void ensureSuper() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isSuper = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + Provider.SUPER.name()));
        if (!isSuper) {
            throw new BasiliumCustomException(
                    ErrorCode.ACCESS_DENIED,
                    "슈퍼 유저만 접근할 수 있습니다."
            );
        }
    }

    /** 전체 브랜드 유저 조회 */
    public List<BrandUser> getAllBrandUsers() {
        return brandUserRepository.findAll();
    }


    /** 프로필 수정 (Dirty Checking) */
    @Transactional
    public void modifyProfile(String userId, BrandUser updated) {
        ensureBrand();
        BrandUser existing = brandUserRepository.findById(userId)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "수정할 브랜드 유저가 없습니다: " + userId
                ));
        existing.updateProfile(
                updated.getFirmName(),
                updated.getFirmAddress(),
                updated.getBusinessRegistration(),
                updated.getFirmWebUrl(),
                updated.getFirmEmail(),
                updated.getFirmPhone()
        );
    }

    /** 내 프로필 조회 */
    public BrandUser getProfile(String userId) {
        return brandUserRepository.findById(userId)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.MEMBER_NOT_FOUND,
                        "브랜드 유저가 없습니다: " + userId
                ));
    }

    /** 브랜드 유저 가입 */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public JoinStatus join(BrandUser candidate) {
        if (brandUserRepository.existsById(candidate.getId())) {
            return JoinStatus.DUPLICATE;
        }
        String pw = candidate.getPassword();
        if (pw.length() < 8 || pw.length() > 16) {
            return JoinStatus.INVALID_PASSWORD_LENGTH;
        }
        boolean hasU = pw.chars().anyMatch(Character::isUpperCase);
        boolean hasL = pw.chars().anyMatch(Character::isLowerCase);
        boolean hasS = pw.chars().anyMatch(c -> "!@#$%^&*()-_=+[]{}|;:'\",.<>/?".indexOf(c) != -1);
        if (!(hasU && hasL && hasS)) {
            return JoinStatus.INVALID_PASSWORD_STRENGTH;
        }
        brandUserRepository.save(candidate);
        return JoinStatus.SUCCESS;
    }

    /** 내 사업자 등록증 업로드 */
    @Transactional
    public String uploadBusinessCert(String userId, MultipartFile file) {
        ensureBrand();
        BrandUser user = getProfile(userId);

        // 이미 등록증이 있으면 에러
        Optional.ofNullable(user.getBusinessRegistrationCertificateImageUrl())
                .ifPresent(fn -> {
                    throw new BasiliumCustomException(
                            ErrorCode.BAD_REQUEST,
                            "이미 등록증이 업로드되어 있습니다."
                    );
                });

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BasiliumCustomException(
                    ErrorCode.BAD_REQUEST,
                    "파일 크기는 5MB 이하입니다."
            );
        }

        // 파일 저장 및 엔티티 업데이트
        String filename = storage.store(
                file,
                imageProperties.getFullBusinessRegDir(),
                Provider.BRAND.getProviderName(),
                userId
        );
        user.updateBusinessCert(filename);
        return filename;
    }

    /** 내 사업자 등록증 조회 */
    @Transactional(readOnly = true)
    public MyBusinessCertDto getMyBusinessCertInfo(String userId) {
        ensureBrand();
        BrandUser user = getProfile(userId);

        String filename = Optional.ofNullable(user.getBusinessRegistrationCertificateImageUrl())
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "등록증이 없습니다."
                ));

        return new MyBusinessCertDto(
                user.getUserNumber(),
                user.getBusinessRegistration(),
                filename,
                imageProperties.getDomainBrandDir() + filename
        );
    }

    /** 어드민/브랜드 사업자 등록증 수정 (기존 파일 삭제 포함) */
    @Transactional
    public String adminUpdateBusinessCert(String adminId, Long targetUserNumber, MultipartFile file) {

        BrandUser user = brandUserRepository.findByBrandUserOfNumber(targetUserNumber)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.MEMBER_NOT_FOUND,
                        "브랜드 유저가 없습니다: " + targetUserNumber
                ));

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BasiliumCustomException(
                    ErrorCode.BAD_REQUEST,
                    "파일 크기는 5MB 이하입니다."
            );
        }

        // 기존 파일이 있으면 삭제
        Optional.ofNullable(user.getBusinessRegistrationCertificateImageUrl())
                .ifPresent(old -> storage.delete(imageProperties.getFullBusinessRegDir(), old));

        String filename = storage.store(
                file,
                imageProperties.getFullBusinessRegDir(),
                Provider.BRAND.getProviderName(),
                user.getId()
        );
        user.updateBusinessCert(filename);
        return filename;
    }

    /** 어드민 사업자 등록증 삭제 */
    @Transactional
    public void adminDeleteBusinessCert(String adminId, Long targetUserNumber) {
        ensureSuper();
        BrandUser user = brandUserRepository.findByBrandUserOfNumber(targetUserNumber)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.MEMBER_NOT_FOUND,
                        "브랜드 유저가 없습니다: " + targetUserNumber
                ));

        Optional.ofNullable(user.getBusinessRegistrationCertificateImageUrl())
                .ifPresent(old -> storage.delete(imageProperties.getFullBusinessRegDir(), old));

        user.updateBusinessCert(null);
    }

    /** 어드민 판매 권한 설정 */
    @Transactional
    public void adminSetSaleAllowed(String adminId, Long targetUserNumber, boolean saleAllowed) {
        ensureSuper();
        BrandUser user = brandUserRepository.findByBrandUserOfNumber(targetUserNumber)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.MEMBER_NOT_FOUND,
                        "브랜드 유저가 없습니다: " + targetUserNumber
                ));

        user.updateSaleAllowed(saleAllowed);
    }

    //브랜드 user id로 user number를 찾음
    public Optional<String> findUserNumberById(String id) {
        return brandUserRepository.findByNumber(id);
    }

    //브랜드 user number로 브랜드유저를 찾음
    public Optional<BrandUser> findByBrandUserOfNumber(Long userNumber) {
        return brandUserRepository.findByBrandUserOfNumber(userNumber);
    }

    // S3스토리지에서 브랜드 유저 id와 이미지를 함께 넘겨주어 id로 유저있는지 확인 후 업로드 aws/products
    public Optional<BrandUser> findById(String id) {
        return brandUserRepository.findById(id);
    }
}