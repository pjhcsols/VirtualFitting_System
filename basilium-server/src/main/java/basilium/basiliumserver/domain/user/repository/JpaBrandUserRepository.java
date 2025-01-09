package basilium.basiliumserver.domain.user.repository;

/*
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
    public List<String> getAllUserImageUrls() {
        return em.createQuery("SELECT m.userImageUrl FROM BrandUser m", String.class).getResultList();
    }

    @Override
    public List<BrandUser> findByUserImageUrlsIn(Set<String> imageUrls) {
        return em.createQuery("SELECT u FROM BrandUser u WHERE u.userImageUrl IN :imageUrls", BrandUser.class)
                .setParameter("imageUrls", imageUrls)
                .getResultList();
    }

    //BrandUser의 id로 userNumber를 찾음
    @Override
    public Optional<String> findByNumber(String id) {
        try {
            String userNumber = em.createQuery(
                            "SELECT b.userNumber FROM BrandUser b WHERE b.id = :id", String.class)
                    .setParameter("id", id)
                    .getSingleResult();
            return Optional.ofNullable(userNumber);
        } catch (NoResultException e) {
            log.info("No BrandUser found with id: {}", id);
            return Optional.empty();
        }
    }

    // BrandUser의 number로 브랜드유저 객체찾음
    @Override
    public Optional<BrandUser> findByBrandUserOfNumber(Long userNumber) {
        try {
            BrandUser brandUser = em.createQuery(
                            "SELECT b FROM BrandUser b WHERE b.userNumber = :userNumber", BrandUser.class)
                    .setParameter("userNumber", userNumber)
                    .getSingleResult();
            return Optional.ofNullable(brandUser);
        } catch (NoResultException e) {
            log.info("No BrandUser found with userNumber: {}", userNumber);
            return Optional.empty();
        }
    }

    //id로 브랜드 유저 객체 불러옴
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
            //existingUser.setUserGrade(brandUser.getUserGrade());//등급은 사용자 정보 수정에서 변경되면 안됨
            //existingUser.setLoginType(brandUser.getLoginType());//브랜드 유저는 일반사용자가 될수없음
            existingUser.setUserImageUrl(brandUser.getUserImageUrl());

            existingUser.setFirmName(brandUser.getFirmName());
            existingUser.setFirmAddress(brandUser.getFirmAddress());
            existingUser.setBusinessRegistration(brandUser.getBusinessRegistration());
            existingUser.setFirmWebUrl(brandUser.getFirmWebUrl());
            em.merge(existingUser); // 변경 내용 저장
        }
    }

    @Override
    public List<String> getAllUserProfileUrls() {
        return em.createQuery("SELECT b.userProfileImageUrl FROM BrandUser b", String.class).getResultList();
    }

    @Override
    public List<BrandUser> findByUserProfileUrlsIn(Set<String> imageUrls) {
        return em.createQuery("SELECT u FROM BrandUser u WHERE u.userProfileImageUrl IN :imageUrls", BrandUser.class)
                .setParameter("imageUrls", imageUrls)
                .getResultList();
    }


}

 */

