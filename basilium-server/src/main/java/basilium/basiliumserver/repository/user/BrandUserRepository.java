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
    Optional<BrandUser> findById(String id); //id로 객체찾기
    Optional<BrandUser> findByEmail(String emailAddress);
    List<String> getAllUserImageUrls();
    List<BrandUser> findByUserImageUrlsIn(Set<String> imageUrls);
    Optional<String> findByNumber(String id); //id로 number찾기
    Optional<BrandUser> findByBrandUserOfNumber(Long userNumber); //number로 브랜드유저 찾기
    List<String> getAllUserProfileUrls();
    List<BrandUser> findByUserProfileUrlsIn(Set<String> imageUrls);
}
