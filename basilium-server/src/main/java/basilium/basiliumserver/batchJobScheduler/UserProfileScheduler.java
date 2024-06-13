package basilium.basiliumserver.batchJobScheduler;

import basilium.basiliumserver.domain.user.BrandUser;
import basilium.basiliumserver.domain.user.NormalUser;
import basilium.basiliumserver.domain.user.SuperUser;
import basilium.basiliumserver.domain.user.User;
import basilium.basiliumserver.repository.user.BrandUserRepository;
import basilium.basiliumserver.repository.user.NormalUserRepository;
import basilium.basiliumserver.repository.user.SuperUserRepository;
import basilium.basiliumserver.service.user.UserStateService;
import jakarta.persistence.EntityManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.Base64;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


//user profile
@Slf4j
@Component
public class UserProfileScheduler {

    @Autowired
    private EntityManager em;

    @Autowired
    private NormalUserRepository normalUserRepository;
    @Autowired
    private BrandUserRepository brandUserRepository;
    @Autowired
    private SuperUserRepository superUserRepository;

    @Value("${profileDir}")
    private String profileDir;

    @Transactional
    //@Scheduled(initialDelay = 60000, fixedDelay = 120000) // 1분 후 처음 실행, 이후 2분 간격으로 실행
    @Scheduled(fixedRate = 24 * 60 * 60 * 1000)
    public void synchronizeProfileImages() {
        log.info("************************************************************************************");
        log.info("[ [user Profile] 스케줄링 시작]");

        // 디렉토리에 존재하는 프로필 이미지 파일과 데이터베이스에 저장된 모든 프로필 이미지 URL 가져오기
        Set<String> directoryProfileUrls = getDirectoryProfileUrls();
        Set<String> dbProfileUrls = getAllUserProfileUrls();
        log.info("userProfileStorage urls: {}", directoryProfileUrls);
        log.info("db urls: {}", dbProfileUrls);

        // 디렉토리에 있는 이미지 파일 중에서 데이터베이스에 없는 파일 삭제
        log.info("1. 디렉토리에 있는 이미지 파일 중에서 DB에 없는 파일 삭제");
        Set<String> filesToDelete = directoryProfileUrls.stream()
                .filter(fileName -> !dbProfileUrls.contains(fileName))
                .collect(Collectors.toSet());

        log.info("교차검증: DB에 없는 디렉토리의 프로필 URL 목록(차집합)");
        log.info(String.valueOf(filesToDelete));

        for (String fileName : filesToDelete) {
            deleteProfileFile(fileName);
        }

        // 데이터베이스에만 있는 프로필 URL을 null로 변경
        log.info("2. 데이터베이스에만 있는 프로필 URL을 null로 변경");
        updateDatabaseProfileUrls(directoryProfileUrls, dbProfileUrls);
        log.info("[user Profile] 스케줄링 완료");
        log.info("************************************************************************************");
    }

    private Set<String> getDirectoryProfileUrls() {
        Set<String> directoryProfileUrls = new HashSet<>();
        File folder = new File(profileDir);
        File[] listOfFiles = folder.listFiles();
        if (listOfFiles != null) {
            for (File file : listOfFiles) {
                if (file.isFile()) {
                    directoryProfileUrls.add(Base64.getEncoder().encodeToString((profileDir + file.getName()).getBytes()));
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
        byte[] decodedBytes = Base64.getDecoder().decode(encodedFilePath);
        String filePath = new String(decodedBytes);
        File profileFile = new File(filePath);
        if (profileFile.exists()) {
            if (profileFile.delete()) {
                log.info("프로필 파일 삭제 성공: {}", filePath);
            } else {
                log.error("프로필 파일 삭제 실패: {}", filePath);
            }
        } else {
            log.warn("삭제할 프로필 파일이 존재하지 않습니다: {}", filePath);
        }
    }

    private void updateDatabaseProfileUrls(Set<String> directoryProfileUrls, Set<String> dbProfileUrls) {
        Set<String> dbOnlyProfileUrls = dbProfileUrls.stream()
                .filter(url -> !directoryProfileUrls.contains(url))
                .collect(Collectors.toSet());
        log.info("교차검증: 디렉토리에 없는 DB 프로필 URL 목록(차집합)");
        log.info(String.valueOf(dbOnlyProfileUrls));

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



