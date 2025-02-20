package basilium.basiliumserver.domain.product.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "product_size_option")
public class ProductSizeOption {

    @EmbeddedId
    private ProductSizeOptionId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "total_length")
    private Long totalLength;

    @Column(name = "chest")
    private Long chest;

    @Column(name = "shoulder")
    private Long shoulder;

    @Column(name = "arm")
    private Long arm;

    public void assignProduct(Product product) {
        this.product = product;
    }

    public void updateFrom(basilium.basiliumserver.domain.product.dto.ProductSizeOptionUpdateRequest sizeUpdate) {
        this.totalLength = sizeUpdate.getTotalLength();
        this.chest = sizeUpdate.getChest();
        this.shoulder = sizeUpdate.getShoulder();
        this.arm = sizeUpdate.getArm();
    }
}
