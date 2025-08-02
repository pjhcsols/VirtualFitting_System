package basilium.basiliumserver.global.configuration;

import basilium.basiliumserver.properties.ImageProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/*
* /Users/hansol/Desktop/VirtualFitting_System/basilium-server/src/main/resources/userImageStorage/super_20250801123000.png ->
* http://basilium.co.kr/b1/images/userImageStorage/brand01_1713958965868_mysql.png
* url 매핑
*/
@Configuration
public class UserImageResourceConfig implements WebMvcConfigurer {

    private final ImageProperties imageProperties;

    @Autowired
    public UserImageResourceConfig(ImageProperties imageProperties) {
        this.imageProperties = imageProperties;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 업로드 이미지
        registry.addResourceHandler("/b1/images/userImageStorage/**")
                .addResourceLocations("file:" + imageProperties.getFullUploadDir())
                .setCachePeriod(3600);

        // 프로필 이미지
        registry.addResourceHandler("/b1/images/userProfileImageStorage/**")
                .addResourceLocations("file:" + imageProperties.getFullProfileDir())
                .setCachePeriod(3600);

        // 리뷰 이미지
        registry.addResourceHandler("/b1/images/userReviewImageStorage/**")
                .addResourceLocations("file:" + imageProperties.getFullReviewDir())
                .setCachePeriod(3600);

        // 사업자 등록증
        registry.addResourceHandler("/b1/images/businessCertificateImageStorage/**")
                .addResourceLocations("file:" + imageProperties.getFullBusinessRegDir())
                .setCachePeriod(3600);

        // 광고 배너
        registry.addResourceHandler("/b1/images/adBannerImageStorage/**")
                .addResourceLocations("file:" + imageProperties.getFullSuperDir())
                .setCachePeriod(3600);
    }
}
