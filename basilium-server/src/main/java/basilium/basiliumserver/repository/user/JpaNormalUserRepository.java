package basilium.basiliumserver.repository.user;

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
public class JpaNormalUserRepository implements NormalUserRepository{
    private final EntityManager em;
    public JpaNormalUserRepository(EntityManager em) {
        this.em = em;
    }

    @Override
    public long count() {
        return em.createQuery("select count(u) from NormalUser u", Long.class).getSingleResult();
    }

    @Override
    public NormalUser save(NormalUser normalUser) {
        em.persist(normalUser);
        return normalUser;
    }
/*
    @Override
    @Transactional
    public NormalUser createNormalUser(NormalUser normalUser) {
        // 고유 ID 생성 및 설정
        normalUser.setUserNumber(null); // ID는 자동 생성
        em.persist(normalUser);
        return normalUser;
    }
    */



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
    public void modify(NormalUser normalUser) {
        NormalUser existingUser = em.find(NormalUser.class, normalUser.getId());
        if (existingUser != null) {
            existingUser.setId(normalUser.getId());
            existingUser.setPassword(normalUser.getPassword());
            existingUser.setEmailAddress(normalUser.getEmailAddress());
            existingUser.setPhoneNumber(normalUser.getPhoneNumber());
            existingUser.setUserGrade(normalUser.getUserGrade());
            existingUser.setName(normalUser.getName());
            existingUser.setBirthDate(normalUser.getBirthDate());
            existingUser.setAddress(normalUser.getAddress());

            em.merge(existingUser); // 변경 내용 저장
        }
    }


/*
    @Override
    public Optional<NormalUser> findById(String id) {
        NormalUser normalUser = em.find(NormalUser.class, id);
        return Optional.ofNullable(normalUser);
    }

 */



    @Override
    public List<NormalUser> findByName(String name) {
        return em.createQuery("select m from NormalUser m where m.name = :name", NormalUser.class).setParameter("name", name).getResultList();
    }

    @Override
    public Optional<NormalUser> findByPhoneNumber(String phoneNumber) {
        NormalUser normalUser = em.createQuery("select m from NormalUser m where m.phoneNumber = :phoneNumber", NormalUser.class).setParameter("phoneNumber", phoneNumber).getSingleResult();
        return Optional.ofNullable(normalUser);
    }

    @Override
    public List<NormalUser> findAll() {
        return em.createQuery("select m from NormalUser m", NormalUser.class).getResultList();
    }

    @Override
    public List<NormalUser> getAllNormalUsers() {
        return em.createQuery("SELECT m FROM NormalUser m", NormalUser.class).getResultList();
    }
}