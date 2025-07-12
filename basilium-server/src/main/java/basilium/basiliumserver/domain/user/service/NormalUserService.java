// src/main/java/basilium/basiliumserver/domain/user/service/NormalUserService.java
package basilium.basiliumserver.domain.user.service;

import basilium.basiliumserver.domain.deliveryInfo.DeliveryInfo;
import basilium.basiliumserver.domain.like.entity.Like;
import basilium.basiliumserver.domain.like.repository.JpaLikeRepo;
import basilium.basiliumserver.domain.product.entity.Product;
import basilium.basiliumserver.domain.product.repository.ProductRepository;
import basilium.basiliumserver.domain.user.dto.NormalUserSignupDTO;
import basilium.basiliumserver.domain.user.dto.UserModifiedInfo;
import basilium.basiliumserver.domain.user.entity.JoinStatus;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import basilium.basiliumserver.domain.user.repository.NormalUserRepository;
import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public JoinStatus join(NormalUserSignupDTO dto) {
        // 중복 ID 검사
        normalUserRepository.findById(dto.getId())
                .ifPresent(u -> { throw new BasiliumCustomException(
                        ErrorCode.DUPLICATE_RESOURCE,
                        "이미 존재하는 회원입니다."); });

        // 비밀번호 길이 & 강도 검증
        String pw = dto.getPassword();
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

        // DTO → Entity (생성자에서 Grade.BRONZE, Provider.NORMAL 설정)
        NormalUser user = new NormalUser(dto);
        normalUserRepository.save(user);

        return JoinStatus.SUCCESS;
    }

    /**
     * 회원 정보 수정
     * - DTO 내 변경된 필드만 엔티티에 반영(updateFrom)
     * - save() 호출 없이 트랜잭션 커밋 시 JPA 더티체킹
     */
    @Transactional
    public void modify(String userId, UserModifiedInfo info) {
        NormalUser existing = userInfoById(userId);
        existing.updateFrom(info);
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