package basilium.basiliumserver.domain.product.entity;


import basilium.basiliumserver.domain.category.Category;
import basilium.basiliumserver.domain.user.entity.BrandUser;
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
    Category productCategory;


    @Column(name="product_name", nullable = false)
    String productName;


    @Column(name="product_price", nullable = false)
    Long productPrice;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_materials", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "product_material")
    List<Material> productMaterial;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "product_size")
    List<Size> productSize;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_colors", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "product_color")
    List<Color> productColor;

    Long productTotalLength; //총장
    Long productChest; //가슴둘레
    Long productShoulder;//어깨길이
    Long productArm;//팔길이

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

    @ManyToOne
    @JoinColumn(name = "brand_user_number") // BrandUser와의 관계를 나타내는 외래 키
    private BrandUser brandUser;

    @Column(name = "total_quantity")
    Long totalQuantity; //총량

}