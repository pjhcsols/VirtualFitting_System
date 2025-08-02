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
    private String brandDir;
    private String superDir;

    private String fullUploadDir;
    private String fullProfileDir;
    private String fullReviewDir;
    private String fullBusinessRegDir;
    private String fullSuperDir;

    //image 도메인 -> db
    private String domainUrl;

    //DB에 저장할 “상대 URL prefix” -> db 저장 url -> UserImageResourceConfig
    private String domainUploadDir;
    private String domainProfileDir;
    private String domainReviewDir;
    private String domainBrandDir;
    private String domainSuperDir;

    @PostConstruct
    private void init() {
        try {
            // 파일 시스템 경로로 절대 경로 변환
            fullUploadDir      = ensureSlash(new File(uploadDir).getAbsolutePath());
            fullProfileDir     = ensureSlash(new File(profileDir).getAbsolutePath());
            fullReviewDir      = ensureSlash(new File(reviewDir).getAbsolutePath());
            fullBusinessRegDir = ensureSlash(new File(brandDir).getAbsolutePath());
            fullSuperDir       = ensureSlash(new File(superDir).getAbsolutePath());

            logger.info("Full Upload Dir: {}", fullUploadDir);
            logger.info("Full Profile Dir: {}", fullProfileDir);
            logger.info("Full Review Dir: {}", fullReviewDir);
            logger.info("Full Business Reg Dir: {}", fullBusinessRegDir);
            logger.info("Full Super Dir: {}", fullSuperDir);

            domainUploadDir   = ensureSlash(domainUrl) + ensureSlash(domainUploadDir);
            domainProfileDir  = ensureSlash(domainUrl) + ensureSlash(domainProfileDir);
            domainReviewDir   = ensureSlash(domainUrl) + ensureSlash(domainReviewDir);
            domainBrandDir    = ensureSlash(domainUrl) + ensureSlash(domainBrandDir);
            domainSuperDir    = ensureSlash(domainUrl) + ensureSlash(domainSuperDir);

            logger.info("Domain Upload Dir:  {}", domainUploadDir);
            logger.info("Domain Profile Dir: {}", domainProfileDir);
            logger.info("Domain Review Dir:  {}", domainReviewDir);
            logger.info("Domain Brand Dir: {}", domainBrandDir);
            logger.info("Domain Super Dir: {}", domainSuperDir);
        } catch (Exception e) {
            logger.error("리소스를 찾을 수 없습니다: {}", e.getMessage());
            throw new RuntimeException("리소스를 찾을 수 없습니다", e);
        }
    }

    private String ensureSlash(String path) {
        return path.endsWith("/") ? path : path + "/";
    }

    // getters & setters
    public String getUploadDir() { return uploadDir; }
    public void setUploadDir(String uploadDir) { this.uploadDir = ensureSlash(uploadDir); }
    public String getProfileDir() { return profileDir; }
    public void setProfileDir(String profileDir) { this.profileDir = ensureSlash(profileDir); }
    public String getReviewDir() { return reviewDir; }
    public void setReviewDir(String reviewDir) { this.reviewDir = ensureSlash(reviewDir); }
    public String getBrandDir() { return brandDir; }
    public void setBrandDir(String brandDir) { this.brandDir = ensureSlash(brandDir); }
    public String getSuperDir() { return superDir; }
    public void setSuperDir(String superDir) { this.superDir = ensureSlash(superDir); }

    public String getFullUploadDir() { return fullUploadDir; }
    public String getFullProfileDir() { return fullProfileDir; }
    public String getFullReviewDir() { return fullReviewDir; }
    public String getFullBusinessRegDir() { return fullBusinessRegDir; }
    public String getFullSuperDir() { return fullSuperDir; }

    public String getDomainUrl() { return domainUrl; }
    public void setDomainUrl(String domainUrl) { this.domainUrl = ensureSlash(domainUrl); }

    public String getDomainUploadDir() { return domainUploadDir; }
    public void setDomainUploadDir(String domainUploadDir) {
        this.domainUploadDir = ensureSlash(domainUploadDir);
    }

    public String getDomainProfileDir() { return domainProfileDir; }
    public void setDomainProfileDir(String domainProfileDir) {
        this.domainProfileDir = ensureSlash(domainProfileDir);
    }

    public String getDomainReviewDir() { return domainReviewDir; }
    public void setDomainReviewDir(String domainReviewDir) {
        this.domainReviewDir = ensureSlash(domainReviewDir);
    }

    public String getDomainBrandDir() { return domainBrandDir; }
    public void setDomainBrandDir(String domainBrandDir) {
        this.domainBrandDir = ensureSlash(domainBrandDir);
    }

    public String getDomainSuperDir() { return domainSuperDir; }
    public void setDomainSuperDir(String domainSuperDir) {
        this.domainSuperDir = ensureSlash(domainSuperDir);
    }

}
