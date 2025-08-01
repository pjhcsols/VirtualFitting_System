package basilium.basiliumserver.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
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
    private String reviewDir;

    private String fullUploadDir;
    private String fullProfileDir;
    private String fullReviewDir;

    //image 도메인 -> db
    private String domainUrl;

    //DB에 저장할 “상대 URL prefix” -> db 저장 url -> UserImageResourceConfig
    private String domainUploadDir;
    private String domainProfileDir;
    private String domainReviewDir;

    @PostConstruct
    private void init() {
        try {
            // 파일 시스템 경로로 절대 경로 변환
            this.fullUploadDir = ensureTrailingSlash(new File(uploadDir).getAbsolutePath());
            this.fullProfileDir = ensureTrailingSlash(new File(profileDir).getAbsolutePath());
            this.fullReviewDir  = ensureTrailingSlash(new File(reviewDir).getAbsolutePath());

            logger.info("Full Upload Dir: {}", fullUploadDir);
            logger.info("Full Profile Dir: {}", fullProfileDir);
            logger.info("Full Review Dir: {}", fullReviewDir);

            domainUploadDir  = ensureTrailingSlash(domainUrl) + ensureTrailingSlash(domainUploadDir);
            domainProfileDir = ensureTrailingSlash(domainUrl) + ensureTrailingSlash(domainProfileDir);
            domainReviewDir  = ensureTrailingSlash(domainUrl) + ensureTrailingSlash(domainReviewDir);

            logger.info("Domain Upload Dir:  {}", domainUploadDir);
            logger.info("Domain Profile Dir: {}", domainProfileDir);
            logger.info("Domain Review Dir:  {}", domainReviewDir);
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

    public String getReviewDir() { return reviewDir; }
    public void setReviewDir(String reviewDir) {
        this.reviewDir = ensureTrailingSlash(reviewDir);
    }

    public String getFullUploadDir() {
        return fullUploadDir;
    }

    public String getFullProfileDir() {
        return fullProfileDir;
    }

    public String getFullReviewDir() {
        return fullReviewDir;
    }

    public String getDomainUrl() {
        return domainUrl;
    }
    public void setDomainUrl(String domainUrl) {
        this.domainUrl = ensureTrailingSlash(domainUrl);
    }

    public String getDomainUploadDir() {
        return domainUploadDir;
    }
    public void setDomainUploadDir(String domainUploadDir) {
        this.domainUploadDir = ensureTrailingSlash(domainUploadDir);
    }

    public String getDomainProfileDir() {
        return domainProfileDir;
    }
    public void setDomainProfileDir(String domainProfileDir) {
        this.domainProfileDir = ensureTrailingSlash(domainProfileDir);
    }

    public String getDomainReviewDir() {
        return domainReviewDir;
    }
    public void setDomainReviewDir(String domainReviewDir) {
        this.domainReviewDir = ensureTrailingSlash(domainReviewDir);
    }

}
