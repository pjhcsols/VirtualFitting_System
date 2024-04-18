package basilium.basiliumserver.repository.user;


import basilium.basiliumserver.domain.user.SuperUser;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Repository
public class JpaSuperUserRepository implements SuperUserRepository {
    private final EntityManager em;

    public JpaSuperUserRepository(EntityManager em) {
        this.em = em;
    }

    @Override
    public long count() {
        return em.createQuery("select count(u) from SuperUser u", Long.class).getSingleResult();
    }

    @Override
    public List<SuperUser> getAllSuperUsers() {
        return em.createQuery("SELECT m FROM SuperUser m", SuperUser.class).getResultList();
    }

    @Override
    public SuperUser save(SuperUser superUser) {
        em.persist(superUser);
        return superUser;
    }

    @Override
    public Optional<SuperUser> findById(String id) {
        try {
            SuperUser superUser = em.createQuery("select m from SuperUser m where m.id = :superUserId", SuperUser.class)
                    .setParameter("superUserId", id)
                    .getSingleResult();
            return Optional.ofNullable(superUser);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<SuperUser> findByEmail(String emailAddress) {
        try {
            SuperUser superUser = em.createQuery("select m from SuperUser m where m.emailAddress = :emailAddress", SuperUser.class)
                    .setParameter("emailAddress", emailAddress)
                    .getSingleResult();
            return Optional.ofNullable(superUser);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

    @Override
    @Transactional
    public void modify(SuperUser superUser) {
        SuperUser existingUser = em.find(SuperUser.class, superUser.getUserNumber());
        if (existingUser != null) {
            existingUser.setId(superUser.getId());
            existingUser.setPassword(superUser.getPassword());
            existingUser.setEmailAddress(superUser.getEmailAddress());
            existingUser.setPhoneNumber(superUser.getPhoneNumber());
            existingUser.setUserImageUrl(superUser.getUserImageUrl());
            // 슈퍼유저 특유의 필드들을 수정하려면 여기에 추가합니다.
            em.merge(existingUser); // 변경 내용 저장
        }
    }
}

