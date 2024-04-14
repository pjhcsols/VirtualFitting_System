package basilium.basiliumserver.repository.user;

import basilium.basiliumserver.domain.user.BrandUser;
import basilium.basiliumserver.domain.user.NormalUser;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Repository
public class JpaBrandUserRepository implements BrandUserRepository {
    private final EntityManager em;

    public JpaBrandUserRepository(EntityManager em) {
        this.em = em;
    }

    @Override
    public long count() {
        return em.createQuery("select count(u) from BrandUser u", Long.class).getSingleResult();
    }

    @Override
    public List<BrandUser> getAllBrandUsers() {
        return em.createQuery("SELECT m FROM BrandUser m", BrandUser.class).getResultList();
    }

    @Override
    public BrandUser save(BrandUser brandUser) {
        em.persist(brandUser);
        return brandUser;
    }

    @Override
    public Optional<BrandUser> findById(String id) {
        try {
            BrandUser brandUser = em.createQuery("select m from BrandUser m where m.id = :brandUserId", BrandUser.class)
                    .setParameter("brandUserId", id)
                    .getSingleResult();
            return Optional.ofNullable(brandUser);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<BrandUser> findByEmail(String emailAddress) {
        try {
            BrandUser brandUser = em.createQuery("select m from BrandUser m where m.emailAddress = :emailAddress", BrandUser.class)
                    .setParameter("emailAddress", emailAddress)
                    .getSingleResult();
            return Optional.ofNullable(brandUser);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }


    @Override
    @Transactional
    public void modify(BrandUser brandUser) {
        BrandUser existingUser = em.find(BrandUser.class, brandUser.getUserNumber());
        if (existingUser != null) {
            existingUser.setId(brandUser.getId());
            existingUser.setPassword(brandUser.getPassword());
            existingUser.setEmailAddress(brandUser.getEmailAddress());
            existingUser.setPhoneNumber(brandUser.getPhoneNumber());
            existingUser.setUserGrade(brandUser.getUserGrade());
            existingUser.setFirmName(brandUser.getFirmName());
            existingUser.setFirmAddress(brandUser.getFirmAddress());
            existingUser.setBusinessRegistration(brandUser.getBusinessRegistration());
            existingUser.setFirmWebUrl(brandUser.getFirmWebUrl());
            em.merge(existingUser); // 변경 내용 저장
        }
    }

}

