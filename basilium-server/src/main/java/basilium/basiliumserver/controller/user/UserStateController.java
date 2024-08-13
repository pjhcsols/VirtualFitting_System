package basilium.basiliumserver.controller.user;

import basilium.basiliumserver.service.DTO.user.LoginRequest;
import basilium.basiliumserver.service.DTO.user.LoginResponse;
import basilium.basiliumserver.properties.ImageProperties;
import basilium.basiliumserver.service.user.UserStateService;
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
@RequestMapping("/User")
@PreAuthorize("isAuthenticated()")
public class UserStateController {

    private final UserStateService userStateService;
    private final ImageProperties imageProperties;
/*
    @Value("${uploadDir}")
    private String uploadDir;

    //사용안함
    @Value("${profileDir}")
    private String profileDir;

    // ClassPathResource를 사용하여 리소스 경로를 얻습니다.
    ClassPathResource locateResource = new ClassPathResource(uploadDir);
    // 실제 파일 저장 경로를 지정합니다.
    File resourceUploadDir = new File(locateResource.getPath());

    // ClassPathResource를 사용하여 리소스 경로를 얻습니다.
    ClassPathResource locateProfileResource = new ClassPathResource(profileDir);
    // 실제 파일 저장 경로를 지정합니다.
    File resourceProfileDir = new File(locateProfileResource.getPath());

 */

    //bean
    @Autowired
    public UserStateController(UserStateService userStateService, ImageProperties imageProperties) {
        this.userStateService = userStateService;
        this.imageProperties = imageProperties;
    }

    /*
        @PostMapping("/login")
        public ResponseEntity<String> loginNormalUser(@RequestBody LoginRequest loginRequest) {
            log.info("------------------------------------------------------------");
            log.info("1. User 로그인 시도");
            log.info("ID: " + loginRequest.getUserId() + " ");
            log.info("Password: " + loginRequest.getUserPassword() + " ");
            LoginStatus loginResult = userStateService.login(loginRequest.getUserId(), loginRequest.getUserPassword());
            if (loginResult != LoginStatus.SUCCESS)
                return new ResponseEntity<>(loginResult.getMessage(), loginResult.getStatus());
            log.info("------------------------------------------------------------");
            log.info("2. 로그인 성공");
            String token = userStateService.afterSuccessLogin(loginRequest.getUserId());
            log.info("[User 토큰 정상 발급]");
            log.info(token);
            return ResponseEntity.ok().body(token);
        }

     */
    @PostMapping("/login")
    public ResponseEntity<?> loginNormalUser(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = userStateService.login(loginRequest.getUserId(), loginRequest.getUserPassword());
        if (response.getType() == null) {

            return new ResponseEntity<>("로그인 실패", HttpStatus.BAD_REQUEST);
        }

        String token = userStateService.createTokenByUserType(loginRequest.getUserId());
        response.setToken(token);
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



    /*
    @PostMapping("/uploadImage")
    public ResponseEntity<String> uploadImage(@AuthUser String userId,
                                              @RequestParam("file") MultipartFile file) {
     */
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

    //2.사용자의 기존에 등록된 이미지 불러오기 버튼
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
