package basilium.basiliumserver.s3Storage.controller;

import basilium.basiliumserver.s3Storage.service.S3StorageService;
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

    @Autowired
    public S3StorageController(S3StorageService s3StorageService) {
        this.s3StorageService = s3StorageService;
    }

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
}

