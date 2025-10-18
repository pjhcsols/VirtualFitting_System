// src/main/java/basilium/basiliumserver/domain/user/service/NormalUserService.java
package basilium.basiliumserver.domain.user.service;

import basilium.basiliumserver.domain.deliveryInfo.DeliveryInfo;
import basilium.basiliumserver.domain.like.entity.Like;
import basilium.basiliumserver.domain.like.repository.JpaLikeRepo;
import basilium.basiliumserver.domain.product.entity.Product;
import basilium.basiliumserver.domain.product.repository.ProductRepository;
import basilium.basiliumserver.domain.user.dto.NormalUserSignupDTO;
import basilium.basiliumserver.domain.user.dto.NormalUserModifiedInfo;
import basilium.basiliumserver.domain.user.entity.JoinStatus;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import basilium.basiliumserver.domain.user.repository.NormalUserRepository;
import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NormalUserService {
    private final NormalUserRepository normalUserRepository;
    private final ProductRepository      productRepository;
    private final JpaLikeRepo            likeRepo;
    private final PasswordEncoder passwordEncoder;

    /** 전체 사용자 조회 */
    public List<NormalUser> getAllNormalUsers() {
        return normalUserRepository.findAll();
    }

    /** 단건 조회 (비즈니스 예외 던짐) */
    public NormalUser userInfoById(String userId) {
        return normalUserRepository.findById(userId)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.MEMBER_NOT_FOUND,
                        "유저가 없습니다: " + userId));
    }

    /**
     * 회원가입
     * - 비밀번호 검증
     * - DTO→엔티티 변환 (생성자에서 Grade·Provider 기본 세팅)
     */
    /** 회원가입: 중복 대조 → 정규화 → 비번 해시 → 저장 */
    // dto set? 쓰지말고 변경할수있음 생성자로 대체
    /** 회원가입: 중복 대조 → 비번 해시 → 생성자 저장 (정규화/DTO set 없음) */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public JoinStatus join(NormalUserSignupDTO dto) {
        final String id    = dto.getId();
        final String email = dto.getEmailAddress();
        final String phone = dto.getPhoneNumber();

        if (normalUserRepository.existsById(id))
            throw new BasiliumCustomException(ErrorCode.DUPLICATE_RESOURCE, "이미 사용 중인 아이디입니다.");
        if (normalUserRepository.existsByEmailAddress(email))
            throw new BasiliumCustomException(ErrorCode.DUPLICATE_RESOURCE, "이미 사용 중인 이메일입니다.");
        if (normalUserRepository.existsByPhoneNumber(phone))
            throw new BasiliumCustomException(ErrorCode.DUPLICATE_RESOURCE, "이미 사용 중인 전화번호입니다.");

        // 앞뒤 공백 제거 .strip()
        final String hashed = passwordEncoder.encode(dto.getPassword().trim());

        NormalUser user = new NormalUser(
                id, hashed, email, phone,
                dto.getName(), dto.getNickname(), dto.getGender(), dto.getBirthDate(), dto.getAddress(),
                dto.getTotalLength(), dto.getChest(), dto.getShoulder(), dto.getArm(),
                dto.getPantsTotalLength(), dto.getWaistWidth(), dto.getHipWidth(), dto.getThighWidth(),
                dto.getRise(), dto.getHemWidth(), dto.getHeight(), dto.getWeight()
        );
        normalUserRepository.save(user);
        return JoinStatus.SUCCESS;
    }

    /**
     * 회원 정보 수정
     * - DTO 내 변경된 필드만 엔티티에 반영(updateFrom)
     * - save() 호출 없이 트랜잭션 커밋 시 JPA 더티체킹
     */
    /** 회원 정보 수정: id 포함 선택 변경 + 중복 대조 + 정규화 + 더티체킹 */
    /** 수정: null 체크 제거(전부 Optional), 비번만 변경 시 해시로 교체 */
    @Transactional
    public void modify(String userId, NormalUserModifiedInfo req) {
        NormalUser existing = userInfoById(userId);

        // 중복 대조 (제공 + 변경 시만)
        req.getId()
                .filter(newId -> !newId.equals(existing.getId()))
                .ifPresent(newId -> {
                    if (normalUserRepository.existsByIdAndUserNumberNot(newId, existing.getUserNumber())) {
                        throw new BasiliumCustomException(ErrorCode.DUPLICATE_RESOURCE, "이미 사용 중인 아이디입니다.");
                    }
                });

        req.getEmailAddress()
                .filter(newEmail -> !newEmail.equals(existing.getEmailAddress()))
                .ifPresent(newEmail -> {
                    if (normalUserRepository.existsByEmailAddressAndUserNumberNot(newEmail, existing.getUserNumber())) {
                        throw new BasiliumCustomException(ErrorCode.DUPLICATE_RESOURCE, "이미 사용 중인 이메일입니다.");
                    }
                });

        req.getPhoneNumber()
                .filter(newPhone -> !newPhone.equals(existing.getPhoneNumber()))
                .ifPresent(newPhone -> {
                    if (normalUserRepository.existsByPhoneNumberAndUserNumberNot(newPhone, existing.getUserNumber())) {
                        throw new BasiliumCustomException(ErrorCode.DUPLICATE_RESOURCE, "이미 사용 중인 전화번호입니다.");
                    }
                });

        // 비밀번호: 동일 평문이면 스킵, 다르면 해시로 교체
        var hashedPwOpt = req.getPassword()
                .filter(raw -> !passwordEncoder.matches(raw, existing.getPassword()))
                .map(passwordEncoder::encode);

        // 패치 객체(원본 req는 불변 유지) — 비번만 해시로 교체
        NormalUserModifiedInfo patch = new NormalUserModifiedInfo(
                req.getId(),
                hashedPwOpt,
                req.getEmailAddress(),
                req.getPhoneNumber(),
                req.getName(),
                req.getNickname(),
                req.getBirthDate(),
                req.getAddress(),
                req.getTotalLength(),
                req.getChest(),
                req.getShoulder(),
                req.getArm(),
                req.getPantsTotalLength(),
                req.getWaistWidth(),
                req.getHipWidth(),
                req.getThighWidth(),
                req.getRise(),
                req.getHemWidth(),
                req.getHeight(),
                req.getWeight()
        );

        // 더티체킹 (@DynamicUpdate) — 존재하는 값만 반영
        existing.updateFrom(patch);
    }

    //밑에 코드 이관 예정 LIKE / Delivery

    /** 배송 정보 조회 (없으면 빈 객체) */
    public DeliveryInfo deliveryInfoByUserNumber(Long userNumber) {
        return Optional.ofNullable(
                        normalUserRepository.findDeliveryInfoByUserNumber(userNumber))
                .orElse(new DeliveryInfo());
    }

    /**
     * 좋아요 등록 (기존 로직 유지)
     */
    @Transactional
    public String setLike(NormalUser normalUser, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "상품이 존재하지 않습니다."));
        Like like = new Like();
        like.setNormalUser(normalUser);
        like.setProduct(product);
        likeRepo.save(like);
        return "Like registered successfully";
    }
}