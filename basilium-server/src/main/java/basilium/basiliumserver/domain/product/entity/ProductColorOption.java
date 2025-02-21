package basilium.basiliumserver.domain.product.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;
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

    // 대표 이미지: List와 @OrderColumn을 사용하여 DB에 저장된 순서를 그대로 유지
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "product_photo_urls", joinColumns = {
            @JoinColumn(name = "product_id", referencedColumnName = "product_id"),
            @JoinColumn(name = "product_color", referencedColumnName = "product_color")
    })
    @Column(name = "product_photo_url")
    @Builder.Default
    private List<String> productPhotoUrls = new ArrayList<>();

    // 서브 이미지: List와 @OrderColumn을 사용하여 DB에 저장된 순서를 그대로 유지
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "product_sub_photo_urls", joinColumns = {
            @JoinColumn(name = "product_id", referencedColumnName = "product_id"),
            @JoinColumn(name = "product_color", referencedColumnName = "product_color")
    })
    @Column(name = "product_sub_photo_url")
    @Builder.Default
    private List<String> productSubPhotoUrls = new ArrayList<>();

    public void assignProduct(Product product) {
        this.product = product;
    }

    public void updateFrom(basilium.basiliumserver.domain.product.dto.ProductColorOptionUpdateRequest colorUpdate) {
        this.productPhotoUrls = new ArrayList<>(colorUpdate.getProductPhotoUrls());
        this.productSubPhotoUrls = new ArrayList<>(colorUpdate.getProductSubPhotoUrls());
    }

    public List<String> getProductPhotoUrls() {
        return Collections.unmodifiableList(productPhotoUrls);
    }

    public List<String> getProductSubPhotoUrls() {
        return Collections.unmodifiableList(productSubPhotoUrls);
    }
}
