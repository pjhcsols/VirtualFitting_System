package basilium.basiliumserver.batchJobScheduler;

import basilium.basiliumserver.s3Storage.service.S3StorageService;
import basilium.basiliumserver.service.product.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

//상품 이미지
@Slf4j
@Component
public class ProductImageScheduler {
    private final ProductService productService;
    private final S3StorageService s3StorageService;

    @Autowired
    public ProductImageScheduler(ProductService productService, S3StorageService s3StorageService) {
        this.productService = productService;
        this.s3StorageService = s3StorageService;
    }


    //@Scheduled(initialDelay = 60000, fixedDelay = 120000) // 1분 후에 시작하고, 그 이후에는 매 2분마다 실행
    @Transactional
    @Scheduled(cron = "0 0 0 * * ?") // 매일 자정마다 실행
    public void deleteUnusedProductImages() {
        log.info("[product 스케줄링 시작]");
        // 1. 데이터베이스와 S3 스토리지에서 상품 이미지 URL을 가져옵니다.
        List<String> databaseUrls = productService.getAllProductImageUrls();
        List<String> s3Urls = s3StorageService.getAllImageUrls();
        log.info("product DB의 Image URL");
        log.info(String.valueOf(databaseUrls));
        log.info("S3 Storage의 Image URL");
        log.info(String.valueOf(s3Urls));

        // 2. 데이터베이스에서 가져온 URL과 S3 스토리지에 있는 URL을 비교하여 없는 URL을 찾습니다.
        List<String> urlsToDelete = s3Urls.stream()
                .filter(url -> !databaseUrls.contains(url))
                .collect(Collectors.toList());
        log.info("DB에 없는 S3스토리지의 이미지 URL 목록(차집합)");
        log.info(String.valueOf(urlsToDelete));

        // 3. 없는 URL에 해당하는 객체를 S3 스토리지에서 삭제합니다.
        s3StorageService.deleteProductPhotos(urlsToDelete);
        log.info("product 스케줄링 완료");
    }
}

