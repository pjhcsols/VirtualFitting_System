package basilium.basiliumserver.service.user;

import basilium.basiliumserver.domain.user.BrandUser;
import basilium.basiliumserver.domain.user.JoinStatus;
import basilium.basiliumserver.domain.user.NormalUser;
import basilium.basiliumserver.repository.user.BrandUserRepository;
import basilium.basiliumserver.repository.user.NormalUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class BrandUserService {

    private final BrandUserRepository brandUserRepository;

    @Autowired
    public BrandUserService(BrandUserRepository brandUserRepository) {
        this.brandUserRepository = brandUserRepository;
    }

    @Value("${jwt.secret}")
    private String secretKey;
    private final Long expiredMs = 1000 * 60 * 60L;

    public List<BrandUser> getAllBrandUsers() {
        return brandUserRepository.getAllBrandUsers();
    }

    public void modify(BrandUser brandUser) {
        brandUserRepository.modify(brandUser);
    }

    public BrandUser userInfoById(String userId) {
        return brandUserRepository.findById(userId).orElse(null);
    }

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
}
