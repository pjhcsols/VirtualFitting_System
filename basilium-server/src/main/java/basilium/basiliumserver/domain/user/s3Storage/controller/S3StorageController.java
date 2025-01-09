package basilium.basiliumserver.domain.user.s3Storage.controller;

import basilium.basiliumserver.domain.user.entity.BrandUser;
import basilium.basiliumserver.domain.user.s3Storage.service.S3StorageService;
import basilium.basiliumserver.domain.user.service.BrandUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/aws/products")
public class S3StorageController {

    private final S3StorageService s3StorageService;
    private final BrandUserService brandUserService; // BrandUserService를 필드로 추가합니다.

    @Autowired
    public S3StorageController(S3StorageService s3StorageService, BrandUserService brandUserService) {
        this.s3StorageService = s3StorageService;
        this.brandUserService = brandUserService; // BrandUserService를 주입합니다.
    }
/*
    @PostMapping("/upload-photo")
    public ResponseEntity<String> uploadProductPhoto(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = s3StorageService.uploadProductPhoto(file);
            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

 */
    @PostMapping("/upload-photo")
    public ResponseEntity<String> uploadProductPhoto(@RequestParam("file") MultipartFile file, @RequestParam("brandUserId") String brandUserId) {
        try {
            BrandUser brandUser = brandUserService.findById(brandUserId).orElseThrow(() -> new RuntimeException("BrandUser not found with id: " + brandUserId));
            String imageUrl = s3StorageService.uploadProductPhoto(file, brandUser);
            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload product photo: " + e.getMessage());
        }
    }




    @DeleteMapping("/delete-photos")
    public ResponseEntity<Void> deleteProductPhotos(@RequestBody List<String> urlsToDelete) {
        s3StorageService.deleteProductPhotos(urlsToDelete);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/get-photo")
    public ResponseEntity<byte[]> getProductPhoto(@RequestParam("imageUrl") String imageUrl) {
        try {
            byte[] imageData = s3StorageService.getProductPhoto(imageUrl).readAllBytes();
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageData);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //스케줄러 용
    @GetMapping("/all/photourl")
    public ResponseEntity<List<String>> getAllImageUrls() {
        List<String> imageUrls = s3StorageService.getAllImageUrls();
        return ResponseEntity.ok(imageUrls);
    }

}

