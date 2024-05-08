package basilium.basiliumserver.domain.user;


import basilium.basiliumserver.domain.product.Product;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class BrandUser extends User{
    @Column(name = "firm_name")
    private String firmName;
    private String firmAddress;
    private String businessRegistration;
    private String firmWebUrl;
/*
    @OneToMany(mappedBy = "brandUser", cascade = CascadeType.REMOVE) //CascadeType.REMOVE를 설정하여 BrandUser가 삭제될 때 관련된 Product도 함께 삭제
    private List<Product> products = new ArrayList<>(); // BrandUser가 소유한 Product 목록


 */
}