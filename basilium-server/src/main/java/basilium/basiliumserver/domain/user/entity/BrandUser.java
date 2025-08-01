package basilium.basiliumserver.domain.user.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class BrandUser extends User{
    @Column(name = "firm_name")
    private String firmName;
    private String firmAddress; //회사주소
    private String businessRegistration; //사업자등록번호
    private String businessRegistrationCertificateImageUrl; // 사업자 이미지 url 저장
    private String firmWebUrl;
    private String firmEmail;
    private String firmPhone;

/*
    @OneToMany(mappedBy = "brandUser", cascade = CascadeType.REMOVE) //CascadeType.REMOVE를 설정하여 BrandUser가 삭제될 때 관련된 Product도 함께 삭제
    private List<Product> products = new ArrayList<>(); // BrandUser가 소유한 Product 목록
 */
}