package basilium.basiliumserver.domain.user.service;

import basilium.basiliumserver.domain.user.entity.BrandUser;
import basilium.basiliumserver.domain.user.entity.JoinStatus;
import basilium.basiliumserver.domain.user.repository.BrandUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
@Transactional
public class BrandUserService {

    private final BrandUserRepository brandUserRepository;

    @Autowired
    public BrandUserService(BrandUserRepository brandUserRepository) {
        this.brandUserRepository = brandUserRepository;
    }


    public List<BrandUser> getAllBrandUsers() {
        return brandUserRepository.findAll();
    }

    public void modify(BrandUser brandUser) {
        brandUserRepository.save(brandUser);
    }

    public BrandUser userInfoById(String userId) {
        return brandUserRepository.findById(userId).orElse(null);
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public JoinStatus join(BrandUser brandUser) {
        try {
            validateDuplicateMember(brandUser);
            checkPasswordLength(brandUser);
            checkStrongPassword(brandUser);
            brandUserRepository.save(brandUser);
            return JoinStatus.SUCCESS;
        } catch (IllegalStateException e) {
            System.out.println(e.getMessage());
            return JoinStatus.DUPLICATE;
        }
    }

    private void validateDuplicateMember(BrandUser brandUser) {
        brandUserRepository.findById(brandUser.getId()).ifPresent(m -> {
            throw new IllegalStateException("이미 존재하는 회원입니다.");
        });
    }

    private void checkPasswordLength(BrandUser brandUser) {
        String password = brandUser.getPassword();
        if (!(password.length() >= 8 && password.length() <= 16)) {
            throw new IllegalStateException("비밀번호는 8 ~ 16자 사이여야 합니다.");
        }
    }

    private void checkStrongPassword(BrandUser brandUser) {
        String password = brandUser.getPassword();
        boolean hasUpperCase = false;
        boolean hasLowerCase = false;
        boolean hasSpecialChar = false;
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) {
                hasUpperCase = true;
            } else if (Character.isLowerCase(c)) {
                hasLowerCase = true;
            } else if ("!@#$%^&*()-_=+[]{}|;:'\",.<>/?".indexOf(c) != -1) {
                hasSpecialChar = true;
            }
        }
        if (!(hasUpperCase && hasLowerCase && hasSpecialChar)) {
            throw new IllegalStateException("비밀번호는 영문 소문자, 대문자, 특수문자를 포함해야됩니다.");
        }
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
