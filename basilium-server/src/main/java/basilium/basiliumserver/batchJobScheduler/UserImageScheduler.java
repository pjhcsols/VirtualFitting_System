package basilium.basiliumserver.batchJobScheduler;

import basilium.basiliumserver.domain.user.BrandUser;
import basilium.basiliumserver.domain.user.NormalUser;
import basilium.basiliumserver.domain.user.SuperUser;
import basilium.basiliumserver.domain.user.User;
import basilium.basiliumserver.properties.ImageProperties;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import basilium.basiliumserver.repository.user.BrandUserRepository;
import basilium.basiliumserver.repository.user.NormalUserRepository;
import basilium.basiliumserver.repository.user.SuperUserRepository;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

//local user 가상착용 이미지
@Component
@RequiredArgsConstructor //오토 와이어 제거
public class UserImageScheduler {
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

    private static final Logger logger = LoggerFactory.getLogger(UserImageScheduler.class);

    @Transactional
    @Scheduled(fixedRate = 24 * 60 * 60 * 1000) // 서버시작시간기준, 24시간마다 실행
    //@Scheduled(initialDelay = 60000, fixedDelay = 120000)
    public void deleteUnusedImages() throws IOException {
        logger.info("************************************************************************************");
        logger.info("[ [user Image] 스케줄링 시작]");

        // 디렉토리에 존재하는 이미지 파일과 데이터베이스에 저장된 모든 이미지 URL 가져오기
        Set<String> directoryImageUrls = getDirectoryImageUrls();
        Set<String> dbImageUrls = getAllUserImageUrls();
        logger.info("userImageStorage urls: {}", directoryImageUrls);
        logger.info("db urls: {}", dbImageUrls);

        // 1. 디렉토리에 있는 이미지 파일 중에서 데이터베이스에 없는 파일 삭제
        logger.info("1. 디렉토리에 있는 이미지 파일 중에서 DB에 없는 파일 삭제");
        Set<String> filesToDelete = directoryImageUrls.stream()
                .filter(fileName -> !dbImageUrls.contains(fileName))
                .collect(Collectors.toSet());

        logger.info("교차검증: DB에 없는 디렉토리의 이미지 URL 목록(차집합)");
        logger.info(String.valueOf(filesToDelete));

        for (String fileName : filesToDelete) {
            deleteImageFile(fileName);
        }

        // 2. 디렉토리의 파일을 URL로 추출하고,
        // 데이터베이스의 각 사용자의 이미지 URL과 비교하여 일치하는 것은 그대로 두고, 데이터베이스에만 있는 이미지 URL을 null로 변경
        logger.info("2. 데이터베이스에만 있는 이미지 URL을 null로 변경");
        updateDatabaseUserImageUrls(directoryImageUrls, dbImageUrls);
        logger.info("[user Image] 스케줄링 완료");
        logger.info("************************************************************************************");
    }



    private Set<String> getDirectoryImageUrls() {
        // 디렉토리에 있는 모든 이미지 파일의 URL을 가져와야 함
        Set<String> directoryImageUrls = new HashSet<>();

        File folder = new File(imageProperties.getFullUploadDir());
        File[] listOfFiles = folder.listFiles();
        if (listOfFiles != null) {
            for (File file : listOfFiles) {
                if (file.isFile()) {
                    directoryImageUrls.add(imageProperties.getFullUploadDir() + file.getName()); // uploadDir과 파일명을 합쳐서 전체 경로를 추가
                }
            }
        }
        return directoryImageUrls;
    }


    private Set<String> getAllUserImageUrls() {
        // 데이터베이스에 저장된 모든 이미지 URL을 가져오는 메서드
        Set<String> allUserImageUrls = new HashSet<>();
        allUserImageUrls.addAll(normalUserRepository.getAllUserImageUrls());
        allUserImageUrls.addAll(brandUserRepository.getAllUserImageUrls());
        allUserImageUrls.addAll(superUserRepository.getAllUserImageUrls());
        return allUserImageUrls;
    }

    private void deleteImageFile(String fileName) {
        // 디렉토리에서 이미지 파일을 삭제하는 메서드
        String imagePath = fileName;
        //log.info(imagePath);
        File imageFile = new File(imagePath);
        if (imageFile.exists()) {
            if (imageFile.delete()) {
                logger.info("이미지 파일 삭제 성공: {}", fileName);
            } else {
                logger.error("이미지 파일 삭제 실패: {}", fileName);
            }
        } else {
            logger.warn("삭제할 이미지 파일이 존재하지 않습니다: {}", fileName);
        }
    }

    private void updateDatabaseUserImageUrls(Set<String> directoryImageUrls, Set<String> dbImageUrls) {
        // 데이터베이스에만 있는 이미지 URL을 null로 변경하는 메서드
        Set<String> dbOnlyImageUrls = dbImageUrls.stream()
                .filter(url -> !directoryImageUrls.contains(url))
                .collect(Collectors.toSet());
        logger.info("교차검증: 디렉토리에 없는 DB 이미지 URL 목록(차집합)");
        logger.info(String.valueOf(dbOnlyImageUrls));//dbOnlyImageUrls

        // 노말 유저의 이미지 URL을 null로 변경
        List<NormalUser> normalUsersToUpdate = normalUserRepository.findByUserImageUrlsIn(dbOnlyImageUrls);
        updateImageUrlsToNull(normalUsersToUpdate);

        // 브랜드 유저의 이미지 URL을 null로 변경
        List<BrandUser> brandUsersToUpdate = brandUserRepository.findByUserImageUrlsIn(dbOnlyImageUrls);
        updateImageUrlsToNull(brandUsersToUpdate);

        // 어드민 유저의 이미지 URL을 null로 변경
        List<SuperUser> superUsersToUpdate = superUserRepository.findByUserImageUrlsIn(dbOnlyImageUrls);
        updateImageUrlsToNull(superUsersToUpdate);

    }

    //@Transactional
    protected void updateImageUrlsToNull(List<? extends User> usersToUpdate) {
        for (User user : usersToUpdate) {
            if (user instanceof NormalUser) {
                NormalUser normalUser = (NormalUser) user;
                normalUser.setUserImageUrl(null);
                em.persist(normalUser);
            } else if (user instanceof BrandUser) {
                BrandUser brandUser = (BrandUser) user;
                brandUser.setUserImageUrl(null);
                em.persist(brandUser);
            } else if (user instanceof SuperUser) {
                SuperUser superUser = (SuperUser) user;
                superUser.setUserImageUrl(null);
                em.persist(superUser);
            }
        }
    }

}