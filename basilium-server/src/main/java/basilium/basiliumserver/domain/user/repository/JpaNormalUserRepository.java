package basilium.basiliumserver.domain.user.repository;
/*
import basilium.basiliumserver.domain.deliveryInfo.DeliveryInfo;
import basilium.basiliumserver.user.domain.NormalUser;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Slf4j
@Repository
public class JpaNormalUserRepository implements NormalUserRepository{
    private final EntityManager em;
    public JpaNormalUserRepository(EntityManager em) {
        this.em = em;
    }

    //총사용자 수
    @Override
    public long count() {
        return em.createQuery("select count(u) from NormalUser u", Long.class).getSingleResult();
    }

    @Override
    public List<NormalUser> getAllNormalUsers() {
        return em.createQuery("SELECT m FROM NormalUser m", NormalUser.class).getResultList();
    }


    @Override
    public NormalUser save(NormalUser normalUser) {
        em.persist(normalUser);
        return normalUser;
    }

    @Override
    public List<String> getAllUserImageUrls() {
        return em.createQuery("SELECT m.userImageUrl FROM NormalUser m", String.class).getResultList();
    }

    @Override
    public List<NormalUser> findByUserImageUrlsIn(Set<String> imageUrls) {
        return em.createQuery("SELECT u FROM NormalUser u WHERE u.userImageUrl IN :imageUrls", NormalUser.class)
                .setParameter("imageUrls", imageUrls)
                .getResultList();
    }


    @Override
    public Optional<NormalUser> findById(String id) {
        try {
            NormalUser normalUser = em.createQuery("select m from NormalUser m where m.id = :normalUsersId", NormalUser.class).setParameter("normalUsersId", id).getSingleResult();
            return Optional.ofNullable(normalUser);
        }catch(NoResultException e){
            return Optional.empty();
        }
    }

    @Override
    public Optional<NormalUser> findByEmail(String emailAddress) {
        try {
        NormalUser normalUser = em.createQuery("select m from NormalUser m where m.emailAddress = :emailAddress", NormalUser.class).setParameter("emailAddress", emailAddress).getSingleResult();
        return Optional.ofNullable(normalUser);
        }catch(NoResultException e){
            return Optional.empty();
        }
    }



    @Override
    public void delete(NormalUser normalUser) {
        NormalUser result = em.find(NormalUser.class, normalUser.getId());
        if (result != null) em.remove(result);
    }

    @Override
    public void deleteById(String id) {
        NormalUser result = em.find(NormalUser.class, id);
        if (result != null) em.remove(result);
    }

    @Override
    public void deleteAll() {
        em.createQuery("delete from NormalUser").executeUpdate();
    }

    @Override
    @Transactional
    public void modify(NormalUser normalUser) {
        //NormalUser existingUser = em.find(NormalUser.class, normalUser.getId());
        NormalUser existingUser = em.find(NormalUser.class, normalUser.getUserNumber());
        if (existingUser != null) {
            existingUser.setId(normalUser.getId());
            existingUser.setPassword(normalUser.getPassword());
            existingUser.setEmailAddress(normalUser.getEmailAddress());
            existingUser.setPhoneNumber(normalUser.getPhoneNumber());
            existingUser.setUserImageUrl(normalUser.getUserImageUrl());


            existingUser.setName(normalUser.getName());
            existingUser.setBirthDate(normalUser.getBirthDate());
            existingUser.setAddress(normalUser.getAddress());

            em.merge(existingUser); // 변경 내용 저장
        }
    }



    @Override
    public List<NormalUser> findByName(String name) {
        return em.createQuery("select m from NormalUser m where m.name = :name", NormalUser.class).setParameter("name", name).getResultList();
    }

    @Override
    public Optional<NormalUser> findByPhoneNumber(String phoneNumber) {
        NormalUser normalUser = em.createQuery("select m from NormalUser m where m.phoneNumber = :phoneNumber", NormalUser.class).setParameter("phoneNumber", phoneNumber).getSingleResult();
        return Optional.ofNullable(normalUser);
    }

    public DeliveryInfo findDeliveryInfoByUserNumber(Long userNumber){
        System.out.println("유저 넘버 : " + userNumber.toString());
        return em.createQuery("select d from DeliveryInfo d where d.normalUser.userNumber = :userNumber", DeliveryInfo.class).setParameter("userNumber", userNumber).getSingleResult();
    }

    @Override
    public List<String> getAllUserProfileUrls() {
        return em.createQuery("SELECT u.userProfileImageUrl FROM NormalUser u", String.class)
                .getResultList();
    }

    @Override
    public List<NormalUser> findByUserProfileUrlsIn(Set<String> imageUrls) {
        return em.createQuery("SELECT u FROM NormalUser u WHERE u.userProfileImageUrl IN :imageUrls", NormalUser.class)
                .setParameter("imageUrls", imageUrls)
                .getResultList();
    }


}


 */