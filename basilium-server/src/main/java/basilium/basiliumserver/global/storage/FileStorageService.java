package basilium.basiliumserver.global.storage;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/*
 * FileStorageService.java
 */
@Service
public class FileStorageService {
    private static final DateTimeFormatter DF = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    public String store(MultipartFile file, String fullDir, String role, String userId) throws IOException {
        String orig = file.getOriginalFilename();
        int dot = orig != null ? orig.lastIndexOf('.') : -1;
        String ext = dot >= 0 ? orig.substring(dot+1) : "";
        String fn = String.format("%s_%s_%s.%s", role, userId, LocalDateTime.now().format(DF), ext);
        Path target = Paths.get(fullDir, fn);
        Files.createDirectories(target.getParent());
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return fn;
    }

    public void delete(String fullDir, String fileName) throws IOException {
        Files.deleteIfExists(Paths.get(fullDir, fileName));
    }
}
