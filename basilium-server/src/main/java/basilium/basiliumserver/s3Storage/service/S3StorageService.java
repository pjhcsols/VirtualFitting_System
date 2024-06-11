package basilium.basiliumserver.s3Storage.service;

import basilium.basiliumserver.domain.user.BrandUser;
import basilium.basiliumserver.repository.user.BrandUserRepository;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

//product 이미지 용
@Service
public class S3StorageService {

    private final S3Client s3Client;
    private final String bucketName;
    private final String bucketUrl;
    private final BrandUserRepository brandUserRepository;


    @Autowired
    public S3StorageService(@Value("${cloud.aws.credentials.accessKey}") String accessKey,
                            @Value("${cloud.aws.credentials.secretKey}") String secretKey,
                            @Value("${cloud.aws.s3.bucket}") String bucketName,
                            @Value("${cloud.aws.s3.bucket.url}") String bucketUrl,
                            BrandUserRepository brandUserRepository) {
        this.s3Client = S3Client.builder()
                .region(Region.AP_NORTHEAST_2) // 원하는 리전을 지정해야 합니다.
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
        this.bucketName = bucketName;
        this.bucketUrl = bucketUrl;
        this.brandUserRepository = brandUserRepository;
    }
/*
    public String uploadProductPhoto(MultipartFile file) throws IOException {
        String fileName = generateFileName(file.getOriginalFilename());
        byte[] fileBytes = file.getBytes();

        try {
            s3Client.putObject(PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(fileName)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromBytes(fileBytes));
        } catch (S3Exception e) {
            // S3 작업 중 예외 발생 시 처리
            throw new IOException("Failed to upload photo to S3: " + e.getMessage());
        }

        return getFullImageUrl(fileName);
    }

 */

    //브랜드 유저 id가 없으면 실행안됨
    public String uploadProductPhoto(MultipartFile file, BrandUser brandUser) throws IOException {
        String fileName = brandUser.getId() + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        byte[] fileBytes = file.getBytes();

        try {
            s3Client.putObject(PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(fileName)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromBytes(fileBytes));
        } catch (S3Exception e) {
            // S3 작업 중 예외 발생 시 처리
            throw new IOException("Failed to upload photo to S3: " + e.getMessage());
        }

        return getFullImageUrl(fileName);
    }

    //예외처리하기
    public void deleteProductPhotos(List<String> urlsToDelete) {
        System.out.println("list size : " + urlsToDelete.size());
        for (String url : urlsToDelete) {
            String key = extractKeyFromUrl(url);
            System.out.println("Deleting photo " + key);
            try {
                s3Client.deleteObject(DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build());
            } catch (S3Exception e) {
                // S3 작업 중 예외 발생 시 처리
                System.err.println("Failed to delete photo from S3: " + e.getMessage());
            }
        }
    }

    public ResponseInputStream<GetObjectResponse> getProductPhoto(String imageUrl) {
        String key = extractKeyFromUrl(imageUrl);
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        return s3Client.getObject(getObjectRequest);
    }

    private String generateFileName(String originalFileName) {
        return UUID.randomUUID().toString() + "-" + originalFileName;
    }

    private String extractKeyFromUrl(String url) {
        // Assuming the URL is in the format: https://s3.ap-northeast-2.amazonaws.com/bucketName/fileName
        int index = url.lastIndexOf('/');
        return url.substring(index + 1);
    }

    private String getFullImageUrl(String fileName) {
        return bucketUrl + "/" + fileName;
    }

    //AWS SDK에서는 클라이언트 사용이 완료되었을 때 클라이언트 리소스를 해제하는 것이 좋습니다.
    //그렇지 않으면 리소스 누수가 발생할 수 있습니다. 이를 위해 close() 메서드를 호출하여 클라이언트를 명시적으로 닫아주는 것
    @PreDestroy
    public void cleanup() {
        s3Client.close();
    }

    //스케줄러 용 s3스토리지의 모든 이미지 url을 들고옴
    public List<String> getAllImageUrls() {
        List<String> imageUrls = new ArrayList<>();
        ListObjectsRequest listObjectsRequest = ListObjectsRequest.builder()
                .bucket(bucketName)
                .build();

        ListObjectsResponse listObjectsResponse = s3Client.listObjects(listObjectsRequest);
        List<S3Object> objects = listObjectsResponse.contents();

        for (S3Object object : objects) {
            String key = object.key();
            String imageUrl = getFullImageUrl(key);
            imageUrls.add(imageUrl);
        }

        return imageUrls;
    }

}

