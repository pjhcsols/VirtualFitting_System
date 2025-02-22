package basilium.basiliumserver.batchJobScheduler;

import basilium.basiliumserver.domain.user.entity.BrandUser;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import basilium.basiliumserver.domain.user.entity.SuperUser;
import basilium.basiliumserver.domain.user.entity.User;
import basilium.basiliumserver.properties.ImageProperties;
import basilium.basiliumserver.domain.user.repository.BrandUserRepository;
import basilium.basiliumserver.domain.user.repository.NormalUserRepository;
import basilium.basiliumserver.domain.user.repository.SuperUserRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.util.Base64;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


//user profile
// 이미지 명만 따와서 비교하기 brand01_1713958965868_mysql.png 서버 이전 시에 기존 디비에 저장된 위치 url이 달라서 날아갈 위험
@Component
@RequiredArgsConstructor //오토와이어 제거
public class UserProfileScheduler {
/*
    @Autowired
    private EntityManager em;

    @Autowired
    private NormalUserRepository normalUserRepository;
    @Autowired
    private BrandUserRepository brandUserRepository;
    @Autowired
    private SuperUserRepository superUserRepository;

    @Autowired
    private ImageProperties imageProperties;

 */
    private final EntityManager em;
    private final NormalUserRepository normalUserRepository;
    private final BrandUserRepository brandUserRepository;
    private final SuperUserRepository superUserRepository;
    private final ImageProperties imageProperties;

    private static final Logger logger = LoggerFactory.getLogger(UserProfileScheduler.class);


    @Transactional
    //@Scheduled(initialDelay = 60000, fixedDelay = 120000) // 1분 후 처음 실행, 이후 2분 간격으로 실행
    @Scheduled(fixedRate = 24 * 60 * 60 * 1000)
    public void synchronizeProfileImages() throws IOException {
        logger.info("************************************************************************************");
        logger.info("[ [user Profile] 스케줄링 시작]");

        // 디렉토리에 존재하는 프로필 이미지 파일과 데이터베이스에 저장된 모든 프로필 이미지 URL 가져오기
        Set<String> directoryProfileUrls = getDirectoryProfileUrls();
        Set<String> dbProfileUrls = getAllUserProfileUrls();
        logger.info("userProfileStorage urls: {}", directoryProfileUrls);
        logger.info("db urls: {}", dbProfileUrls);

        // 디렉토리에 있는 이미지 파일 중에서 데이터베이스에 없는 파일 삭제
        logger.info("1. 디렉토리에 있는 이미지 파일 중에서 DB에 없는 파일 삭제");
        Set<String> filesToDelete = directoryProfileUrls.stream()
                .filter(fileName -> !dbProfileUrls.contains(fileName))
                .collect(Collectors.toSet());

        logger.info("교차검증: DB에 없는 디렉토리의 프로필 URL 목록(차집합)");
        logger.info(String.valueOf(filesToDelete));

        for (String fileName : filesToDelete) {
            deleteProfileFile(fileName);
        }

        // 데이터베이스에만 있는 프로필 URL을 null로 변경
        logger.info("2. 데이터베이스에만 있는 프로필 URL을 null로 변경");
        updateDatabaseProfileUrls(directoryProfileUrls, dbProfileUrls);
        logger.info("[user Profile] 스케줄링 완료");
        logger.info("************************************************************************************");
    }

    private Set<String> getDirectoryProfileUrls() {
        Set<String> directoryProfileUrls = new HashSet<>();
        File folder = new File(imageProperties.getFullProfileDir());
        File[] listOfFiles = folder.listFiles();
        if (listOfFiles != null) {
            for (File file : listOfFiles) {
                if (file.isFile()) {
                    String filePath = imageProperties.getFullProfileDir() + file.getName();
                    String encodedFilePath = Base64.getUrlEncoder().encodeToString(filePath.getBytes());
                    directoryProfileUrls.add(encodedFilePath);
                }
            }
        }
        return directoryProfileUrls;
    }


    private Set<String> getAllUserProfileUrls() {
        Set<String> allUserProfileUrls = new HashSet<>();
        allUserProfileUrls.addAll(normalUserRepository.getAllUserProfileUrls());
        allUserProfileUrls.addAll(brandUserRepository.getAllUserProfileUrls());
        allUserProfileUrls.addAll(superUserRepository.getAllUserProfileUrls());
        return allUserProfileUrls;
    }

    private void deleteProfileFile(String encodedFilePath) {
        byte[] decodedBytes = Base64.getUrlDecoder().decode(encodedFilePath);
        String filePath = new String(decodedBytes);
        File profileFile = new File(filePath);
        if (profileFile.exists()) {
            if (profileFile.delete()) {
                logger.info("프로필 파일 삭제 성공: {}", filePath);
            } else {
                logger.error("프로필 파일 삭제 실패: {}", filePath);
            }
        } else {
            logger.warn("삭제할 프로필 파일이 존재하지 않습니다: {}", filePath);
        }
    }

    private void updateDatabaseProfileUrls(Set<String> directoryProfileUrls, Set<String> dbProfileUrls) {
        Set<String> dbOnlyProfileUrls = dbProfileUrls.stream()
                .filter(url -> !directoryProfileUrls.contains(url))
                .collect(Collectors.toSet());
        logger.info("교차검증: 디렉토리에 없는 DB 프로필 URL 목록(차집합)");
        logger.info(String.valueOf(dbOnlyProfileUrls));

        List<NormalUser> normalUsersToUpdate = normalUserRepository.findByUserProfileUrlsIn(dbOnlyProfileUrls);
        updateProfileUrlsToNull(normalUsersToUpdate);

        List<BrandUser> brandUsersToUpdate = brandUserRepository.findByUserProfileUrlsIn(dbOnlyProfileUrls);
        updateProfileUrlsToNull(brandUsersToUpdate);

        List<SuperUser> superUsersToUpdate = superUserRepository.findByUserProfileUrlsIn(dbOnlyProfileUrls);
        updateProfileUrlsToNull(superUsersToUpdate);
    }

    protected void updateProfileUrlsToNull(List<? extends User> usersToUpdate) {
        for (User user : usersToUpdate) {
            if (user instanceof NormalUser) {
                NormalUser normalUser = (NormalUser) user;
                normalUser.setUserProfileImageUrl(null);
                em.persist(normalUser);
            } else if (user instanceof BrandUser) {
                BrandUser brandUser = (BrandUser) user;
                brandUser.setUserProfileImageUrl(null);
                em.persist(brandUser);
            } else if (user instanceof SuperUser) {
                SuperUser superUser = (SuperUser) user;
                superUser.setUserProfileImageUrl(null);
                em.persist(superUser);
            }
        }
    }
}



