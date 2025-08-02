package basilium.basiliumserver.domain.user.controller;

import basilium.basiliumserver.domain.user.dto.LoginRequest;
import basilium.basiliumserver.domain.user.dto.LoginResponse;
import basilium.basiliumserver.domain.user.dto.RefreshTokenResponse;
import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import basilium.basiliumserver.global.auth.support.AuthUser;
import basilium.basiliumserver.properties.ImageProperties;
import basilium.basiliumserver.domain.user.service.UserStateService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.Optional;

//@PreAuthorize("isAuthenticated()")
@Slf4j
@RestController
@RequestMapping("/b1/users")
@RequiredArgsConstructor
public class UserStateController {

    private final UserStateService userStateService;
    private final ImageProperties imageProperties;

    /** 로그인 */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest req) {

        LoginResponse resp = userStateService.login(req.getUserId(), req.getUserPassword());
        Optional.ofNullable(resp.getType())
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.UNAUTHENTICATED, "로그인 실패"));

        return ResponseEntity.ok(ApiResponse.success(resp));
    }

    /** 로그아웃 */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(HttpServletRequest request) {
        userStateService.logout(request);
        return ResponseEntity.ok(ApiResponse.success("로그아웃 성공"));
    }

    /** 회원 탈퇴 (현재 사용자) */
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> withdraw(@AuthUser String userId) {
        userStateService.deleteUser(userId);
        // return ResponseEntity.ok(ApiResponse.success());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.success());
    }

    /** 액세스 토큰 재발급 */
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<RefreshTokenResponse>> refreshToken(
            @RequestParam String refreshToken) {
        RefreshTokenResponse resp = userStateService.refreshAccessToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success(resp));
    }

    //사용자가 이미지 업로드 시 저장 후 image url 프론트에게 반환
    //아니면 백엔드에서 이미지 전송을 AI에게 바로 주는 로직 추가
    //새로운 이미지 삽입시 이미지 url 교체 작업됨
    //1. 새로운 이미지로 모델링하기 버튼
    /** 이미지 업로드 */
    @PostMapping(value = "/me/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> uploadImage(
            @AuthUser String userId,
            @RequestParam("file") MultipartFile file) {
        String url = userStateService.uploadImage(userId, file);
        return ResponseEntity.ok(ApiResponse.success(url));
    }

    //2.사용자의 기존에 등록된 이미지url 불러오기 버튼
    /** 이미지 URL 조회 */
    @GetMapping("/me/image")
    public ResponseEntity<ApiResponse<String>> getImageUrl(@AuthUser String userId) {
        String url = Optional.ofNullable(userStateService.getUserImageUrl(userId))
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.RESOURCE_NOT_FOUND, "이미지 URL을 찾을 수 없습니다."));
        return ResponseEntity.ok(ApiResponse.success(url));
    }

    //1. AI 서버에서 이미지 url을 전달해주면 그 url의 사진 이미지 파일을 전송하는 기능
    /** 이미지 파일 전송 */
    @PostMapping("/image/file")
    public ResponseEntity<byte[]> getImageFileByUrl(@RequestBody String imageUrl) throws IOException {
        String filename = Paths.get(imageUrl).getFileName().toString();
        String path = imageProperties.getFullUploadDir() + filename;
        byte[] data = userStateService.getImageFileByUrl(path);
        return ResponseEntity
                .ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(data);
    }

    /** 프로필 이미지 업로드 */
    @PostMapping(value = "/me/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> uploadProfileImage(
            @AuthUser String userId,
            @RequestParam("file") MultipartFile file) {
        String encoded = userStateService.uploadProfileImage(userId, file);
        return ResponseEntity.ok(ApiResponse.success(encoded));
    }

    /** 프로필 이미지 조회 */
    @GetMapping("/me/profile-image")
    public ResponseEntity<byte[]> getProfileImage(@AuthUser String userId) throws IOException {
        byte[] data = userStateService.getProfileImage(userId);
        return ResponseEntity
                .ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(data);
    }

}


/*

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

 */

/*
public class ImageConverter {
        public static byte[] convertToJPEG(String imagePath) throws java.io.IOException {
            File file = new File(imagePath);
            BufferedImage image = ImageIO.read(file);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(image, "jpg", outputStream);

            return outputStream.toByteArray();
        }
    }

    public class ImageConverter {
        public static byte[] convertToJPEG(String imagePath) throws IOException {
            // (기능 그대로 유지)
            java.io.File file = new java.io.File(imagePath);
            java.awt.image.BufferedImage image = javax.imageio.ImageIO.read(file);
            java.io.ByteArrayOutputStream outputStream = new java.io.ByteArrayOutputStream();
            javax.imageio.ImageIO.write(image, "jpg", outputStream);
            return outputStream.toByteArray();
        }
    }
 */


/*
25.7.13 일
 */
/*
package basilium.basiliumserver.domain.user.controller;

import basilium.basiliumserver.domain.user.dto.LoginRequest;
import basilium.basiliumserver.domain.user.dto.LoginResponse;
import basilium.basiliumserver.domain.user.dto.RefreshTokenResponse;
import basilium.basiliumserver.global.apiResponse.ApiResponse;
import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import basilium.basiliumserver.global.auth.support.AuthUser;
import basilium.basiliumserver.properties.ImageProperties;
import basilium.basiliumserver.domain.user.service.UserStateService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/b1/users")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class UserStateController {

    private final UserStateService userStateService;
    private final ImageProperties   imageProperties;


@PostMapping("/login")
public ResponseEntity<ApiResponse<LoginResponse>> login(
        @Valid @RequestBody LoginRequest req) {

    LoginResponse resp = userStateService.login(req.getUserId(), req.getUserPassword());
    Optional.ofNullable(resp.getType())
            .orElseThrow(() -> new BasiliumCustomException(
                    ErrorCode.UNAUTHENTICATED, "로그인 실패"));

    return ResponseEntity.ok(ApiResponse.success(resp));
}


@PostMapping("/logout")
public ResponseEntity<ApiResponse<String>> logout(HttpServletRequest request) {
    userStateService.logout(request);
    return ResponseEntity.ok(ApiResponse.success("로그아웃 성공"));
}


@DeleteMapping("/me")
public ResponseEntity<ApiResponse<Void>> withdraw(@AuthUser String userId) {
    userStateService.deleteUser(userId);
    return ResponseEntity.ok(ApiResponse.success());
}


@PostMapping("/refresh-token")
public ResponseEntity<ApiResponse<RefreshTokenResponse>> refreshToken(
        @RequestParam String refreshToken) {

    RefreshTokenResponse resp = userStateService.refreshAccessToken(refreshToken);
    Optional.ofNullable(resp.getAccessToken())
            .orElseThrow(() -> new BasiliumCustomException(
                    ErrorCode.INVALID_INPUT_VALUE, "리프레시 토큰이 유효하지 않습니다."));

    return ResponseEntity.ok(ApiResponse.success(resp));
}


@PostMapping(value = "/me/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<ApiResponse<String>> uploadImage(
        @AuthUser String userId,
        @RequestParam("file") MultipartFile file) {

    String url = Optional.ofNullable(userStateService.uploadImage(userId, file))
            .orElseThrow(() -> new BasiliumCustomException(
                    ErrorCode.SERVER_ERROR, "이미지 업로드에 실패하였습니다."));
    return ResponseEntity.ok(ApiResponse.success(url));
}


@GetMapping("/me/image")
public ResponseEntity<ApiResponse<String>> getImageUrl(@AuthUser String userId) {
    String url = Optional.ofNullable(userStateService.getUserImageUrl(userId))
            .orElseThrow(() -> new BasiliumCustomException(
                    ErrorCode.RESOURCE_NOT_FOUND, "이미지 URL을 찾을 수 없습니다."));
    return ResponseEntity.ok(ApiResponse.success(url));
}


@PostMapping("/image/file")
public ResponseEntity<byte[]> getImageFileByUrl(@RequestBody String imageUrl) {
    byte[] data;
    try {
        String filename = Paths.get(imageUrl).getFileName().toString();
        String path     = imageProperties.getFullUploadDir() + filename;
        data = Optional.ofNullable(userStateService.getImageFileByUrl(path))
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.RESOURCE_NOT_FOUND, "이미지 파일을 찾을 수 없습니다."));
    } catch (IOException e) {
        throw new BasiliumCustomException(
                ErrorCode.SERVER_ERROR, "이미지 파일 전송 중 오류가 발생했습니다.");
    }
    return ResponseEntity
            .ok()
            .contentType(MediaType.IMAGE_PNG)
            .body(data);
}


@PostMapping(value = "/me/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<ApiResponse<String>> uploadProfileImage(
        @AuthUser String userId,
        @RequestParam("file") MultipartFile file) {

    String encoded = Optional.ofNullable(userStateService.uploadProfileImage(userId, file))
            .orElseThrow(() -> new BasiliumCustomException(
                    ErrorCode.SERVER_ERROR, "프로필 이미지 업로드에 실패하였습니다."));
    return ResponseEntity.ok(ApiResponse.success(encoded));
}


@GetMapping("/me/profile-image")
public ResponseEntity<byte[]> getProfileImage(@AuthUser String userId) {
    byte[] data = Optional.ofNullable(userStateService.getProfileImage(userId))
            .orElseThrow(() -> new BasiliumCustomException(
                    ErrorCode.RESOURCE_NOT_FOUND, "프로필 이미지를 찾을 수 없습니다."));
    return ResponseEntity
            .ok()
            .contentType(MediaType.IMAGE_JPEG)
            .body(data);
}
}

 */