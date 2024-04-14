package basilium.basiliumserver.repository.user;


import basilium.basiliumserver.domain.user.BrandUser;

import java.util.List;
import java.util.Optional;

public interface BrandUserRepository {

    List<BrandUser> getAllBrandUsers();
    BrandUser save(BrandUser brandUser);
    Optional<BrandUser> findById(String id);
    Optional<BrandUser> findByEmail(String emailAddress);
}
