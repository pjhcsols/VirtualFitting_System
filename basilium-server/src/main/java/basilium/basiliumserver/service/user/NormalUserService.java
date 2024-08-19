package basilium.basiliumserver.service.user;

import basilium.basiliumserver.domain.like.Like;
import basilium.basiliumserver.domain.product.Product;
import basilium.basiliumserver.domain.deliveryInfo.DeliveryInfo;
import basilium.basiliumserver.domain.user.JoinStatus;
import basilium.basiliumserver.domain.user.NormalUser;
import basilium.basiliumserver.repository.like.JpaLikeRepo;
import basilium.basiliumserver.repository.product.JpaProductRepository;
import basilium.basiliumserver.repository.user.JpaNormalUserRepository;
import basilium.basiliumserver.repository.user.NormalUserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Slf4j
@Service
public class NormalUserService {
    private final NormalUserRepository normalUserRepository;
    private final JpaNormalUserRepository jpaNormalUserRepository;
    private final JpaProductRepository productRepository;
    private final JpaLikeRepo likeRepo;

    //bean
    @Autowired
    public NormalUserService(NormalUserRepository normalUserRepository, JpaNormalUserRepository jpaNormalUserRepository, JpaProductRepository productRepository,JpaLikeRepo likeRepo) {
        this.normalUserRepository = normalUserRepository;
        this.jpaNormalUserRepository = jpaNormalUserRepository;
        this.productRepository = productRepository;
        this.likeRepo = likeRepo;
    }


    public List<NormalUser> getAllNormalUsers() {
        return normalUserRepository.getAllNormalUsers();
    }

    public void modify(NormalUser normalUser) {
        jpaNormalUserRepository.modify(normalUser);
    }

    public NormalUser userInfoById(String userId){
        Optional<NormalUser> optionalUser = normalUserRepository.findById(userId);
        if (optionalUser.isPresent()) {
            return optionalUser.get();
        } else {
            // 사용자가 존재하지 않는 경우 예외 처리 또는 다른 방법으로 처리
            return null; // 또는 예외를 던지거나 기본값을 반환할 수 있음
        }
    }


    public DeliveryInfo deliveryInfoByUserNumber(Long userNumber){
        return jpaNormalUserRepository.findDeliveryInfoByUserNumber(userNumber);
    }
    //회원가입
    //동시성 락걸음
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public JoinStatus join(NormalUser normalUser){
        try{
            validateDuplicateMember(normalUser);
        }
        catch (IllegalStateException e){
            System.out.println(e);
            return JoinStatus.DUPLICATE;
        }
        try{
            checkPasswordLength(normalUser);
        }
        catch (IllegalStateException e){
            System.out.println(e);
            return JoinStatus.INVALID_PASSWORD_LENGTH;
        }
        try{
            checkStrongPassword(normalUser);
        }
        catch (IllegalStateException e)
        {
            System.out.println(e);
            return JoinStatus.INVALID_PASSWORD_STRENGTH;
        }
        normalUserRepository.save(normalUser);
        return JoinStatus.SUCCESS;
    }

    private void validateDuplicateMember(NormalUser normalUser) {
        normalUserRepository.findById(normalUser.getId()).ifPresent(m->{
            throw new IllegalStateException("이미 존재하는 회원입니다.");
        });
    }

    private void checkPasswordLength(NormalUser normalUser) {
        if (normalUser.getPassword().length() >= 8 && normalUser.getPassword().length() <= 16) return;
        else throw new IllegalStateException("비밀번호는 8 ~ 16자 사이여야 합니다.");
    }

    private void checkStrongPassword(NormalUser normalUser){
        String password = normalUser.getPassword();
        boolean hasUpperCase = false;
        boolean hasLowerCase = false;
        boolean hasSpecialChar = false;
        for (char c : password.toCharArray()){
            if (Character.isUpperCase(c))
                hasUpperCase = true;
            else if (Character.isLowerCase(c))
                hasLowerCase = true;
            else if ("!@#$%^&*()-_=+[]{}|;:'\",.<>/?".indexOf(c) != -1)
                hasSpecialChar = true;
        }
        if (!(hasUpperCase && hasLowerCase && hasSpecialChar))throw new IllegalStateException("비밀번호는 영문 소문자, 대문자, 특수문자를 포함해야됩니다.");
    }


    @Transactional
    public String setLike(NormalUser normalUser, Long productId){
        Product product = productRepository.findById(productId).get();
        Like like = new Like();
        like.setNormalUser(normalUser);
        like.setProduct(product);
        return likeRepo.save(like);
    }


}