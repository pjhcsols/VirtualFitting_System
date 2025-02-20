package basilium.basiliumserver.domain.user.service;

import basilium.basiliumserver.domain.like.entity.Like;
import basilium.basiliumserver.domain.product.repository.ProductRepository;
import basilium.basiliumserver.domain.user.entity.JoinStatus;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import basilium.basiliumserver.domain.user.repository.NormalUserRepository;
import basilium.basiliumserver.domain.product.entity.Product;
import basilium.basiliumserver.domain.deliveryInfo.DeliveryInfo;
import basilium.basiliumserver.domain.like.repository.JpaLikeRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Slf4j
@Service
public class NormalUserService {
    private final NormalUserRepository normalUserRepository;
    private final ProductRepository productRepository;
    private final JpaLikeRepo likeRepo;

    @Autowired
    public NormalUserService(NormalUserRepository normalUserRepository, ProductRepository productRepository, JpaLikeRepo likeRepo) {
        this.normalUserRepository = normalUserRepository;
        this.productRepository = productRepository;
        this.likeRepo = likeRepo;
    }

    public List<NormalUser> getAllNormalUsers() {
        return normalUserRepository.findAll();
    }

    public void modify(NormalUser normalUser) {
        normalUserRepository.save(normalUser);  // 이미 존재하는 사용자라면 업데이트
    }

    public NormalUser userInfoById(String userId) {
        return normalUserRepository.findById(userId)
                .orElse(null);  // 사용자 정보가 없으면 null 반환
    }

    public DeliveryInfo deliveryInfoByUserNumber(Long userNumber) {
        return normalUserRepository.findDeliveryInfoByUserNumber(userNumber);
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
        if (!(hasUpperCase && hasLowerCase && hasSpecialChar))
            throw new IllegalStateException("비밀번호는 영문 소문자, 대문자, 특수문자를 포함해야됩니다.");
    }

/*
    @Transactional
    public String setLike(NormalUser normalUser, Long productId){
        Product product = productRepository.findById(productId).get();
        Like like = new Like();
        like.setNormalUser(normalUser);
        like.setProduct(product);
        return likeRepo.save(like);
    }

 */

    @Transactional
    public String setLike(NormalUser normalUser, Long productId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new IllegalStateException("상품이 존재하지 않습니다."));
        Like like = new Like();
        like.setNormalUser(normalUser);
        like.setProduct(product);
        likeRepo.save(like);
        return "Like registered successfully";
    }


}