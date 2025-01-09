package basilium.basiliumserver.domain.user.controller;

import basilium.basiliumserver.domain.user.dto.LoginRequest;
import basilium.basiliumserver.domain.user.dto.LoginResponse;
import basilium.basiliumserver.properties.ImageProperties;
import basilium.basiliumserver.domain.user.dto.RefreshTokenResponse;
import basilium.basiliumserver.domain.user.service.UserStateService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;

//user 통합 로그인
@Slf4j
@RestController
@RequestMapping("/users")
@PreAuthorize("isAuthenticated()")
public class UserStateController {

    private final UserStateService userStateService;
    private final ImageProperties imageProperties;

    @Autowired
    public UserStateController(UserStateService userStateService, ImageProperties imageProperties) {
        this.userStateService = userStateService;
        this.imageProperties = imageProperties;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginNormalUser(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = userStateService.login(loginRequest.getUserId(), loginRequest.getUserPassword());
        if (response.getType() == null) {
            return new ResponseEntity<>("로그인 실패", HttpStatus.BAD_REQUEST);
        }
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        try {
            userStateService.logout(request);
            return new ResponseEntity<>("로그아웃 성공", HttpStatus.OK);
        } catch (Exception e) {
            //return new ResponseEntity<>("로그아웃 실패: " + e.getMessage(), HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>("로그아웃 실패", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<RefreshTokenResponse> refreshAccessToken(@RequestParam String refreshToken) {
        RefreshTokenResponse response = userStateService.refreshAccessToken(refreshToken);

        if (response.getAccessToken() == null) {
            return ResponseEntity.badRequest().body(response);  // 잘못된 요청인 경우
        }

        return ResponseEntity.ok(response);  // 성공적으로 액세스 토큰이 발급된 경우
    }



    //사용자가 이미지 업로드 시 저장 후 image url 프론트에게 반환
    //아니면 백엔드에서 이미지 전송을 AI에게 바로 주는 로직 추가
    //새로운 이미지 삽입시 이미지 url 교체 작업됨
    //1. 새로운 이미지로 모델링하기 버튼
    @PostMapping("/uploadImage")
    public ResponseEntity<String> uploadImage(@RequestParam("userId") String userId,
                                              @RequestParam("file") MultipartFile file) {
        String imageUrl = userStateService.uploadImage(userId, file);
        if (imageUrl != null) {
            return ResponseEntity.ok().body(imageUrl);
        } else {
            return ResponseEntity.badRequest().body("이미지 업로드에 실패하였습니다.");
        }
    }

    //2.사용자의 기존에 등록된 이미지url 불러오기 버튼
    @GetMapping("/getImageUrl")
    public ResponseEntity<String> getUserImageUrl(@RequestParam("userId") String userId) {
        log.info("-----------------------------------------------------------");
        log.info(userId);
        String imageUrl = userStateService.getUserImageUrl(userId);
        log.info(imageUrl);
        if (imageUrl != null) {
            return ResponseEntity.ok().body(imageUrl);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자의 이미지 URL을 찾을 수 없습니다.");
        }
    }



    //1. AI 서버에서 이미지 url을 전달해주면 그 url의 사진 이미지 파일을 전송하는 기능
    @PostMapping("/sentUserImageFile")
    public ResponseEntity<byte[]> getImageFileByUrl(@RequestBody String imageUrl) {
        try {
            String fileName = getImageFileName(imageUrl);
            String absoluteImagePath = imageProperties.getFullUploadDir() + fileName;

            byte[] imageByte = userStateService.getImageFileByUrl(absoluteImagePath);
            log.info("전송 성공");
            //return ResponseEntity.ok().body(imageByte);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(imageByte);
        } catch (java.io.IOException e) {
            log.info("전송 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    private String getImageFileName(String imageUrl) {
        return imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
    }

    public class ImageConverter {
        public static byte[] convertToJPEG(String imagePath) throws java.io.IOException {
            File file = new File(imagePath);
            BufferedImage image = ImageIO.read(file);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(image, "jpg", outputStream);

            return outputStream.toByteArray();
        }
    }

    //user profile
    @PostMapping("/uploadProfileImage")
    public ResponseEntity<String> uploadProfileImage(@RequestParam("userId") String userId,
                                                     @RequestParam("file") MultipartFile file) {
        String encodedPath = userStateService.uploadProfileImage(userId, file);
        if (encodedPath != null) {
            return ResponseEntity.ok().body(encodedPath);
        } else {
            return ResponseEntity.badRequest().body("프로필 이미지 업로드에 실패하였습니다.");
        }
    }

    @GetMapping("/getProfileImage")
    public ResponseEntity<byte[]> getProfileImage(@RequestParam("userId") String userId) {
        try {
            byte[] image = userStateService.getProfileImage(userId);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(image);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

}
