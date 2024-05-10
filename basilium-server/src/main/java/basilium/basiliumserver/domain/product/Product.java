package basilium.basiliumserver.domain.product;


import basilium.basiliumserver.domain.user.BrandUser;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @SequenceGenerator(name = "product_sequence", sequenceName = "PRODUCT_SEQUENCE", allocationSize = 1)
    @Column(name = "product_id", nullable = false, columnDefinition = "int")
    Long productId;


    @ManyToOne
    @JoinColumn(name = "category_id")
    basilium.basiliumserver.domain.product.Category productCategory;


    @Column(name="product_name", nullable = false)
    String productName;


    @Column(name="product_price", nullable = false)
    Long productPrice;

    @Column(name="product_desc", nullable = false)
    String productDesc;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_photo_urls", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "product_photo_url")
    List<String> productPhotoUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_sub_photo_urls", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "product_sub_photo_url")
    List<String> productSubPhotoUrl;


    /*
    @Column(name="product_photo_url")
    String productPhotoUrl;

    @Column(name="product_sub_photo_url")
    String productSubPhotoUrl;
     */

    @ManyToOne
    @JoinColumn(name = "brand_user_number") // BrandUser와의 관계를 나타내는 외래 키
    private BrandUser brandUser;

    //삭제하기
    /*
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "firm_name")
    private BrandUser productFirmName;

    public Product(){

    }
    */


}