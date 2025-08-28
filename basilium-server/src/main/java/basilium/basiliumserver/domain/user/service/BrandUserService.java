// src/main/java/basilium/basiliumserver/domain/user/service/BrandUserService.java
package basilium.basiliumserver.domain.user.service;

import basilium.basiliumserver.domain.user.dto.BrandUserDto;
import basilium.basiliumserver.domain.user.dto.MyBusinessCertDto;
import basilium.basiliumserver.domain.user.entity.BrandUser;
import basilium.basiliumserver.domain.user.entity.Provider;
import basilium.basiliumserver.domain.user.repository.BrandUserRepository;
import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import basilium.basiliumserver.global.image.FileStorageService;
import basilium.basiliumserver.properties.ImageProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final PasswordEncoder passwordEncoder;

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

    /* ===== 생성(가입) ===== */
    @Transactional
    public void signUp(BrandUserDto.Signup dto) {
        final String loginId   = dto.getId().trim(); // 대소문자 허용: 보존
        final String email     = dto.getEmailAddress().trim().toLowerCase();
        final String phoneE164 = dto.getPhoneNumber().trim();     // E.164 그대로
        final String firmEmail = dto.getFirmEmail().trim().toLowerCase();
        final String hashed    = passwordEncoder.encode(dto.getPassword().trim());

        if (brandUserRepository.existsById(loginId))
            throw new BasiliumCustomException(ErrorCode.DUPLICATE_RESOURCE, "이미 사용 중인 아이디입니다.");
        if (brandUserRepository.existsByEmailAddress(email))
            throw new BasiliumCustomException(ErrorCode.DUPLICATE_RESOURCE, "이미 사용 중인 이메일입니다.");
        if (brandUserRepository.existsByPhoneNumber(phoneE164))
            throw new BasiliumCustomException(ErrorCode.DUPLICATE_RESOURCE, "이미 사용 중인 전화번호입니다.");

        BrandUser u = new BrandUser(
                loginId, hashed, email, phoneE164,
                dto.getFirmName(), dto.getFirmAddress(), dto.getBusinessRegistration(),
                dto.getFirmWebUrl(), firmEmail, dto.getFirmPhone()
        );
        brandUserRepository.save(u);
    }

    /* ===== 수정(더티체킹) ===== */
    @Transactional
    public void modify(String currentUserId, BrandUserDto.Update dto) {
        ensureBrand();
        BrandUser existing = getProfile(currentUserId);

        final var idOpt        = Optional.ofNullable(dto.getId()).map(String::trim);
        final var pwHashOpt    = Optional.ofNullable(dto.getPassword()).map(String::trim).map(passwordEncoder::encode);
        final var emailOpt     = Optional.ofNullable(dto.getEmailAddress()).map(s -> s.trim().toLowerCase());
        final var phoneOpt     = Optional.ofNullable(dto.getPhoneNumber()).map(String::trim);
        final var firmNameOpt  = Optional.ofNullable(dto.getFirmName()).map(String::trim);
        final var firmAddrOpt  = Optional.ofNullable(dto.getFirmAddress()).map(String::trim);
        final var bizRegOpt    = Optional.ofNullable(dto.getBusinessRegistration()).map(String::trim);
        final var webUrlOpt    = Optional.ofNullable(dto.getFirmWebUrl()).map(String::trim);
        final var firmEmailOpt = Optional.ofNullable(dto.getFirmEmail()).map(s -> s.trim().toLowerCase());
        final var firmPhoneOpt = Optional.ofNullable(dto.getFirmPhone()).map(String::trim);

        // 2) 변경 의도 있는 값에 한정해 중복 대조(각 1회)
        idOpt.filter(newId -> !newId.equals(existing.getId()))
                .filter(newId -> brandUserRepository.existsByIdAndUserNumberNot(newId, existing.getUserNumber()))
                .ifPresent(x -> { throw new BasiliumCustomException(ErrorCode.DUPLICATE_RESOURCE, "이미 사용 중인 아이디입니다."); });

        emailOpt.filter(newEmail -> !newEmail.equals(existing.getEmailAddress()))
                .filter(newEmail -> brandUserRepository.existsByEmailAddressAndUserNumberNot(newEmail, existing.getUserNumber()))
                .ifPresent(x -> { throw new BasiliumCustomException(ErrorCode.DUPLICATE_RESOURCE, "이미 사용 중인 이메일입니다."); });

        phoneOpt.filter(newPhone -> !newPhone.equals(existing.getPhoneNumber()))
                .filter(newPhone -> brandUserRepository.existsByPhoneNumberAndUserNumberNot(newPhone, existing.getUserNumber()))
                .ifPresent(x -> { throw new BasiliumCustomException(ErrorCode.DUPLICATE_RESOURCE, "이미 사용 중인 전화번호입니다."); });

        // 3) 최종값 병합(미제공 → 기존값) 후 엔티티에 반영(더티체킹)
        existing.updateBrandUser(
                idOpt.orElseGet(existing::getId),
                pwHashOpt.orElseGet(existing::getPassword),
                emailOpt.orElseGet(existing::getEmailAddress),
                phoneOpt.orElseGet(existing::getPhoneNumber),
                firmNameOpt.orElseGet(existing::getFirmName),
                firmAddrOpt.orElseGet(existing::getFirmAddress),
                bizRegOpt.orElseGet(existing::getBusinessRegistration),
                webUrlOpt.orElseGet(existing::getFirmWebUrl),
                firmEmailOpt.orElseGet(existing::getFirmEmail),
                firmPhoneOpt.orElseGet(existing::getFirmPhone)
        );
        // 트랜잭션 커밋 시 dirty checking으로 UPDATE 발행
    }

    /** 내 프로필 조회 */
    public BrandUser getProfile(String userId) {
        return brandUserRepository.findById(userId)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.MEMBER_NOT_FOUND,
                        "브랜드 유저가 없습니다: " + userId
                ));
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