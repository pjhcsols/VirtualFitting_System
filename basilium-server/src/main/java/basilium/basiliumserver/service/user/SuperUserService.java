package basilium.basiliumserver.service.user;


import basilium.basiliumserver.domain.user.JoinStatus;
import basilium.basiliumserver.domain.user.SuperUser;
import basilium.basiliumserver.repository.user.SuperUserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@Transactional
public class SuperUserService {
    private final SuperUserRepository superUserRepository;

    @Autowired
    public SuperUserService(SuperUserRepository superUserRepository) {
        this.superUserRepository = superUserRepository;
    }

    @Value("${jwt.secret}")
    private String secretKey;
    private final Long expiredMs = 1000 * 60 * 60L;

    public List<SuperUser> getAllSuperUsers() {
        return superUserRepository.getAllSuperUsers();
    }

    public void modify(SuperUser superUser) {
        superUserRepository.modify(superUser);
    }

    public SuperUser userInfoById(String userId) {
        return superUserRepository.findById(userId).orElse(null);
    }

    public JoinStatus join(SuperUser superUser) {
        try {
            validateDuplicateMember(superUser);
            checkPasswordLength(superUser);
            checkStrongPassword(superUser);
            superUserRepository.save(superUser);
            return JoinStatus.SUCCESS;
        } catch (IllegalStateException e) {
            log.error(e.getMessage());
            return JoinStatus.DUPLICATE;
        }
    }

    private void validateDuplicateMember(SuperUser superUser) {
        superUserRepository.findById(superUser.getId()).ifPresent(m -> {
            throw new IllegalStateException("이미 존재하는 회원입니다.");
        });
    }

    private void checkPasswordLength(SuperUser superUser) {
        String password = superUser.getPassword();
        if (!(password.length() >= 8 && password.length() <= 16)) {
            throw new IllegalStateException("비밀번호는 8 ~ 16자 사이여야 합니다.");
        }
    }

    private void checkStrongPassword(SuperUser superUser) {
        String password = superUser.getPassword();
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
