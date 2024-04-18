package basilium.basiliumserver.batchJobScheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import basilium.basiliumserver.domain.user.BrandUser;
import basilium.basiliumserver.domain.user.NormalUser;
import basilium.basiliumserver.domain.user.SuperUser;
import basilium.basiliumserver.repository.user.BrandUserRepository;
import basilium.basiliumserver.repository.user.NormalUserRepository;
import basilium.basiliumserver.repository.user.SuperUserRepository;
import java.io.File;


@Component
public class UserImageScheduler {

    @Autowired
    private NormalUserRepository normalUserRepository;
    @Autowired
    private BrandUserRepository brandUserRepository;
    @Autowired
    private SuperUserRepository superUserRepository;

    @Value("${uploadDir}")
    private String uploadDir;

    @Scheduled(fixedRate = 24 * 60 * 60 * 1000) // 24시간마다 실행
    public void deleteOldImagesAndUrls() {
        // 사용자 URL 전체 삭제
        Iterable<NormalUser> normalUsers = normalUserRepository.getAllNormalUsers();
        for (NormalUser user : normalUsers) {
            user.setUserImageUrl(null);
            normalUserRepository.save(user);
        }
        Iterable<BrandUser> brandUsers = brandUserRepository.getAllBrandUsers();
        for (BrandUser user : brandUsers) {
            user.setUserImageUrl(null);
            brandUserRepository.save(user);
        }
        Iterable<SuperUser> superUsers = superUserRepository.getAllSuperUsers();
        for (SuperUser user : superUsers) {
            user.setUserImageUrl(null);
            superUserRepository.save(user);
        }

        // 로컬 서버에 저장된 이미지 전체 삭제
        File folder = new File(uploadDir);
        File[] listOfFiles = folder.listFiles();
        if (listOfFiles != null) {
            for (File file : listOfFiles) {
                if (file.isFile()) {
                    file.delete();
                }
            }
        }
    }
}