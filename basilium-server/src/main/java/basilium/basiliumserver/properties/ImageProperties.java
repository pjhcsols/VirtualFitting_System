package basilium.basiliumserver.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import jakarta.annotation.PostConstruct;

import java.io.File;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

//어플리케이션 프로포티 image 스토리지 관련 설정
@Configuration
@ConfigurationProperties(prefix = "image")
public class ImageProperties {

    private static final Logger logger = LoggerFactory.getLogger(ImageProperties.class);

    private String uploadDir;
    private String profileDir;
    private String fullUploadDir;
    private String fullProfileDir;

    @PostConstruct
    private void init() {
        try {
            // 파일 시스템 경로로 절대 경로 변환
            this.fullUploadDir = ensureTrailingSlash(new File(uploadDir).getAbsolutePath());
            this.fullProfileDir = ensureTrailingSlash(new File(profileDir).getAbsolutePath());

            logger.info("Full Upload Dir: {}", fullUploadDir);
            logger.info("Full Profile Dir: {}", fullProfileDir);
        } catch (Exception e) {
            logger.error("리소스를 찾을 수 없습니다: {}", e.getMessage());
            throw new RuntimeException("리소스를 찾을 수 없습니다", e);
        }
    }

    private String ensureTrailingSlash(String path) {
        return path.endsWith("/") ? path : path + "/";
    }

    public String getUploadDir() {
        return uploadDir;
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = ensureTrailingSlash(uploadDir);
    }

    public String getProfileDir() {
        return profileDir;
    }

    public void setProfileDir(String profileDir) {
        this.profileDir = ensureTrailingSlash(profileDir);
    }

    public String getFullUploadDir() {
        return fullUploadDir;
    }

    public String getFullProfileDir() {
        return fullProfileDir;
    }
}
