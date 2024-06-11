package basilium.basiliumserver.repository.user;


import basilium.basiliumserver.domain.user.SuperUser;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface SuperUserRepository {
    long count();
    void modify(SuperUser superUser);
    List<SuperUser> getAllSuperUsers();
    SuperUser save(SuperUser superUser);
    Optional<SuperUser> findById(String id);
    Optional<SuperUser> findByEmail(String emailAddress);
    List<String> getAllUserImageUrls();
    List<SuperUser> findByUserImageUrlsIn(Set<String> imageUrls);
    List<String> getAllUserProfileUrls();
    List<SuperUser> findByUserProfileUrlsIn(Set<String> imageUrls);
}
