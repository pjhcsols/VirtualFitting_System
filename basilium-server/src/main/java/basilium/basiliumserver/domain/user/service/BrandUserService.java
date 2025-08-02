// src/main/java/basilium/basiliumserver/domain/user/service/BrandUserService.java
package basilium.basiliumserver.domain.user.service;

import basilium.basiliumserver.domain.user.dto.MyBusinessCertDto;
import basilium.basiliumserver.domain.user.entity.BrandUser;
import basilium.basiliumserver.domain.user.entity.JoinStatus;
import basilium.basiliumserver.domain.user.repository.BrandUserRepository;
import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import basilium.basiliumserver.global.storage.FileStorageService;
import basilium.basiliumserver.properties.ImageProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class BrandUserService {

    private final BrandUserRepository brandUserRepository;
    private final FileStorageService storage;
    private final ImageProperties imageProperties;

    public List<BrandUser> getAllBrandUsers() {
        return brandUserRepository.findAll();
    }

    @Transactional
    public void modifyProfile(String userId, BrandUser updated) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isBrand = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_BRAND"));
        if (!isBrand) {
            throw new BasiliumCustomException(
                    ErrorCode.ACCESS_DENIED,
                    "브랜드유저만 수정할 수 있습니다."
            );
        }

        BrandUser existing = brandUserRepository.findById(userId)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "수정할 브랜드 유저가 없습니다: " + userId
                ));

        // Dirty checking via entity method
        existing.updateProfile(
                updated.getFirmName(),
                updated.getFirmAddress(),
                updated.getBusinessRegistration(),
                updated.getFirmWebUrl(),
                updated.getFirmEmail(),
                updated.getFirmPhone()
        );
    }

    public BrandUser getProfile(String userId) {
        return brandUserRepository.findById(userId)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.MEMBER_NOT_FOUND,
                        "브랜드 유저가 없습니다: " + userId
                ));
    }

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
        boolean hasS = pw.chars().anyMatch(c ->
                "!@#$%^&*()-_=+[]{}|;:'\",.<>/?".indexOf(c) != -1);
        if (!(hasU && hasL && hasS)) {
            return JoinStatus.INVALID_PASSWORD_STRENGTH;
        }
        brandUserRepository.save(candidate);
        return JoinStatus.SUCCESS;
    }

    @Transactional
    public String uploadBusinessCert(String userId, MultipartFile file) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isBrand = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_BRAND"));
        if (!isBrand) {
            throw new BasiliumCustomException(
                    ErrorCode.ACCESS_DENIED,
                    "브랜드유저만 등록증을 업로드할 수 있습니다."
            );
        }

        BrandUser user = getProfile(userId);
        Optional.ofNullable(user.getBusinessRegistrationCertificateImageUrl())
                .ifPresent(fn -> {
                    throw new BasiliumCustomException(
                            ErrorCode.BAD_REQUEST,
                            "이미 등록증이 있습니다."
                    );
                });

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BasiliumCustomException(
                    ErrorCode.BAD_REQUEST,
                    "파일 크기는 5MB 이하입니다."
            );
        }

        try {
            String filename = storage.store(
                    file,
                    imageProperties.getFullBusinessRegDir(),
                    "brand",
                    userId
            );
            user.updateBusinessCert(filename);
            return filename;
        } catch (IOException e) {
            throw new BasiliumCustomException(
                    ErrorCode.SERVER_ERROR,
                    "파일 저장 실패: " + e.getMessage()
            );
        }
    }

    @Transactional(readOnly = true)
    public MyBusinessCertDto getMyBusinessCertInfo(String userId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isBrand = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_BRAND"));
        if (!isBrand) {
            throw new BasiliumCustomException(
                    ErrorCode.ACCESS_DENIED,
                    "브랜드유저만 등록증을 조회할 수 있습니다."
            );
        }

        BrandUser user = getProfile(userId);
        String filename = Optional.ofNullable(user.getBusinessRegistrationCertificateImageUrl())
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "등록증이 없습니다."
                ));

        return new MyBusinessCertDto(
                user.getUserNumber(),
                filename,
                imageProperties.getDomainBrandDir() + filename
        );
    }

    @Transactional
    public String adminUpdateBusinessCert(String adminId, Long targetUserNumber, MultipartFile file) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isSuper = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER"));
        if (!isSuper) {
            throw new BasiliumCustomException(
                    ErrorCode.ACCESS_DENIED,
                    "슈퍼유저만 수정할 수 있습니다."
            );
        }

        BrandUser user = brandUserRepository.findByBrandUserOfNumber(targetUserNumber)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.MEMBER_NOT_FOUND,
                        "브랜드 유저가 없습니다: " + targetUserNumber
                ));

        Optional.ofNullable(user.getBusinessRegistrationCertificateImageUrl())
                .ifPresent(old -> {
                    try { storage.delete(imageProperties.getFullBusinessRegDir(), old); }
                    catch (IOException ignored) {}
                });

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BasiliumCustomException(
                    ErrorCode.BAD_REQUEST,
                    "파일 크기는 5MB 이하입니다."
            );
        }

        try {
            String filename = storage.store(
                    file,
                    imageProperties.getFullBusinessRegDir(),
                    "brand",
                    user.getId()
            );
            user.updateBusinessCert(filename);
            return filename;
        } catch (IOException e) {
            throw new BasiliumCustomException(
                    ErrorCode.SERVER_ERROR,
                    "저장 실패: " + e.getMessage()
            );
        }
    }

    @Transactional
    public void adminDeleteBusinessCert(String adminId, Long targetUserNumber) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isSuper = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER"));
        if (!isSuper) {
            throw new BasiliumCustomException(
                    ErrorCode.ACCESS_DENIED,
                    "슈퍼유저만 삭제할 수 있습니다."
            );
        }

        BrandUser user = brandUserRepository.findByBrandUserOfNumber(targetUserNumber)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.MEMBER_NOT_FOUND,
                        "브랜드 유저가 없습니다: " + targetUserNumber
                ));

        Optional.ofNullable(user.getBusinessRegistrationCertificateImageUrl())
                .ifPresent(old -> {
                    try { storage.delete(imageProperties.getFullBusinessRegDir(), old); }
                    catch (IOException ignored) {}
                });

        user.updateBusinessCert(null);
    }

    @Transactional
    public void adminSetSaleAllowed(String adminId, Long targetUserNumber, boolean saleAllowed) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isSuper = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER"));
        if (!isSuper) {
            throw new BasiliumCustomException(
                    ErrorCode.ACCESS_DENIED,
                    "슈퍼유저만 권한을 설정할 수 있습니다."
            );
        }

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
