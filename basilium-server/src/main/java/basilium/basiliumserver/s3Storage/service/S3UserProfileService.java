package basilium.basiliumserver.s3Storage.service;

import basilium.basiliumserver.repository.user.BrandUserRepository;
import basilium.basiliumserver.repository.user.NormalUserRepository;
import basilium.basiliumserver.repository.user.SuperUserRepository;
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
import java.util.UUID;

//만약 s3에 user image를 올리면 사용
/*
@Service
public class S3UserProfileService {

    private final S3Client s3Client;
    private final String bucketName;
    private final String bucketUrl;

    @Autowired
    public S3UserProfileService(@Value("${cloud.aws.credentials.accessKey}") String accessKey,
                                @Value("${cloud.aws.credentials.secretKey}") String secretKey,
                                @Value("${cloud.aws.s3.bucket}") String bucketName,
                                @Value("${cloud.aws.s3.bucket.url}") String bucketUrl) {
        this.s3Client = S3Client.builder()
                .region(Region.AP_NORTHEAST_2)
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
        this.bucketName = bucketName;
        this.bucketUrl = bucketUrl;
    }

    public String uploadUserProfilePhoto(MultipartFile file, String userId) throws IOException {
        String fileName = userId + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        byte[] fileBytes = file.getBytes();

        try {
            s3Client.putObject(PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(fileName)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromBytes(fileBytes));
        } catch (S3Exception e) {
            throw new IOException("Failed to upload photo to S3: " + e.getMessage());
        }

        return getFullImageUrl(fileName);
    }

    public void deleteUserProfilePhoto(String imageUrl) {
        String key = extractKeyFromUrl(imageUrl);

        try {
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build());
        } catch (S3Exception e) {
            System.err.println("Failed to delete photo from S3: " + e.getMessage());
        }
    }

    public byte[] getUserProfilePhoto(String imageUrl) throws IOException {
        String key = extractKeyFromUrl(imageUrl);
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        ResponseInputStream<GetObjectResponse> response = s3Client.getObject(getObjectRequest);
        return response.readAllBytes();
    }

    private String extractKeyFromUrl(String url) {
        int index = url.lastIndexOf('/');
        return url.substring(index + 1);
    }

    private String getFullImageUrl(String fileName) {
        return bucketUrl + "/" + fileName;
    }
}


 */