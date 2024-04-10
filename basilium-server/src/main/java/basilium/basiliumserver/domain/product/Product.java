package basilium.basiliumserver.domain.product;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @SequenceGenerator(name = "product_sequence", sequenceName = "PRODUCT_SEQUENCE", allocationSize = 1)
    @Column(name = "product_id", nullable = false, columnDefinition = "int")
    Long productId;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "category_id")
    Category productCategory;


    @Column(name="product_name", nullable = false)
    String productName;


    @Column(name="product_price", nullable = false)
    Long productPrice;

    @Column(name="product_desc", nullable = false)
    String productDesc;

    @Column(name="product_photo_url")
    String productPhotoUrl;

}

