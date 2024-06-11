package basilium.basiliumserver.s3Storage.controller;
/*
import basilium.basiliumserver.s3Storage.service.S3UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/aws/user-profile")
public class S3UserProfileController {

    private final S3UserProfileService s3UserProfileService;

    @Autowired
    public S3UserProfileController(S3UserProfileService s3UserProfileService) {
        this.s3UserProfileService = s3UserProfileService;
    }

    @PostMapping("/upload-photo")
    public ResponseEntity<String> uploadUserProfilePhoto(@RequestParam("file") MultipartFile file, @RequestParam("userId") String userId) {
        try {
            String imageUrl = s3UserProfileService.uploadUserProfilePhoto(file, userId);
            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload user profile photo: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-photo")
    public ResponseEntity<Void> deleteUserProfilePhoto(@RequestParam("imageUrl") String imageUrl) {
        s3UserProfileService.deleteUserProfilePhoto(imageUrl);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/get-photo")
    public ResponseEntity<byte[]> getUserProfilePhoto(@RequestParam("imageUrl") String imageUrl) {
        try {
            byte[] imageData = s3UserProfileService.getUserProfilePhoto(imageUrl);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageData);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}


 */