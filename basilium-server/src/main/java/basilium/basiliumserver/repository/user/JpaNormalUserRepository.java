package basilium.basiliumserver.repository.user;

import basilium.basiliumserver.domain.user.NormalUser;
import jakarta.persistence.EntityManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
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
            existingUser.setPassword(normalUser.getPassword());
            existingUser.setAge(normalUser.getAge());
            existingUser.setAddress(normalUser.getAddress());
            existingUser.setUserGrade(normalUser.getUserGrade());
            existingUser.setPhoneNumber(normalUser.getPhoneNumber());
            existingUser.setName(normalUser.getName());
            existingUser.setEmailAddress(normalUser.getEmailAddress());
            em.merge(existingUser); // 변경 내용 저장
        }
    }

    @Override
    public NormalUser save(NormalUser normalUser) {
        em.persist(normalUser);
        return normalUser;
    }

    @Override
    public Optional<NormalUser> findById(String id) {
        NormalUser normalUser = em.find(NormalUser.class, id);
        return Optional.ofNullable(normalUser);
    }

    @Override
    public Optional<NormalUser> findByEmail(String emailAddress) {
        NormalUser normalUser = em.createQuery("select m from NormalUser m where m.emailAddress = :emailAddress", NormalUser.class).setParameter("emailAddress", emailAddress).getSingleResult();
        return Optional.ofNullable(normalUser);
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

    @Override
    public List<NormalUser> findAll() {
        return em.createQuery("select m from NormalUser m", NormalUser.class).getResultList();
    }

    @Override
    public List<NormalUser> getAllNormalUsers() {
        return em.createQuery("SELECT m FROM NormalUser m", NormalUser.class).getResultList();
    }
}
