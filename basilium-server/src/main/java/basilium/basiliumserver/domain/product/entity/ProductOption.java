package basilium.basiliumserver.domain.product.entity;

import basilium.basiliumserver.domain.product.dto.ProductOptionDTO;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

import java.util.Optional;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "product_option")
public class ProductOption {

    @EmbeddedId
    private ProductOptionId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "option_quantity", nullable = false)
    private Long optionQuantity;

    @Version
    @Column(name = "version", nullable = false, columnDefinition = "bigint default 0")
    private Long version;

    public void assignProduct(Product product) {
        this.product = product;
    }

    /*
    public void updateQuantity(Long newQuantity) {
        this.optionQuantity = newQuantity;
    }
     */

    public void updateQuantity(Long newQuantity) {
        final long old = Optional.ofNullable(this.optionQuantity).orElseGet(() -> 0L);
        this.optionQuantity = Optional.ofNullable(newQuantity)
                .orElseThrow(() -> new IllegalArgumentException("optionQuantity는 null일 수 없습니다."));
        Optional.ofNullable(product).ifPresent(p -> p.applyOptionDelta(this.optionQuantity - old));
    }

    // ProductOptionUpdateRequest를 기반으로 옵션 업데이트
    public void updateFrom(ProductOptionDTO optUpdate) {
        this.updateQuantity(optUpdate.getOptionQuantity());
    }
}
