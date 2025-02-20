package basilium.basiliumserver.domain.product.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

import java.util.Collections;
import java.util.List;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "product_color_option")
public class ProductColorOption {

    @EmbeddedId
    private ProductColorOptionId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "product_photo_urls", joinColumns = {
            @JoinColumn(name = "product_id", referencedColumnName = "product_id"),
            @JoinColumn(name = "product_color", referencedColumnName = "product_color")
    })
    @Column(name = "product_photo_url")
    private List<String> productPhotoUrls;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "product_sub_photo_urls", joinColumns = {
            @JoinColumn(name = "product_id", referencedColumnName = "product_id"),
            @JoinColumn(name = "product_color", referencedColumnName = "product_color")
    })
    @Column(name = "product_sub_photo_url")
    private List<String> productSubPhotoUrls;

    public void assignProduct(Product product) {
        this.product = product;
    }

    public void updateFrom(basilium.basiliumserver.domain.product.dto.ProductColorOptionUpdateRequest colorUpdate) {
        this.productPhotoUrls = colorUpdate.getProductPhotoUrls();
        this.productSubPhotoUrls = colorUpdate.getProductSubPhotoUrls();
    }

    public List<String> getProductPhotoUrls() {
        return productPhotoUrls == null ? Collections.emptyList() : Collections.unmodifiableList(productPhotoUrls);
    }

    public List<String> getProductSubPhotoUrls() {
        return productSubPhotoUrls == null ? Collections.emptyList() : Collections.unmodifiableList(productSubPhotoUrls);
    }
}
