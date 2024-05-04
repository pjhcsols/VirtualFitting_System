package basilium.basiliumserver.repository.user;


import basilium.basiliumserver.domain.user.BrandUser;
import basilium.basiliumserver.domain.user.NormalUser;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface BrandUserRepository {
    long count();
    void modify(BrandUser brandUser);
    List<BrandUser> getAllBrandUsers();
    BrandUser save(BrandUser brandUser);
    Optional<BrandUser> findById(String id);
    Optional<BrandUser> findByEmail(String emailAddress);
    List<String> getAllUserImageUrls();
    List<BrandUser> findByUserImageUrlsIn(Set<String> imageUrls);
}
