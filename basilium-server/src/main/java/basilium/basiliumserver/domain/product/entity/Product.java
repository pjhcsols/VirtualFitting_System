package basilium.basiliumserver.domain.product.entity;

import basilium.basiliumserver.domain.category.Category;
import basilium.basiliumserver.domain.product.dto.ProductUpdateRequest;
import basilium.basiliumserver.domain.user.entity.BrandUser;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.util.*;
import java.util.function.BiConsumer;
import java.util.function.Function;
import java.util.function.Predicate;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "productId")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @SequenceGenerator(name = "product_sequence", sequenceName = "PRODUCT_SEQUENCE", allocationSize = 1)
    @Column(name = "product_id", nullable = false)
    private Long productId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category productCategory;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "product_price", nullable = false)
    private Long productPrice;

    @Enumerated(EnumType.STRING)
    @Fetch(FetchMode.SUBSELECT)
    @BatchSize(size = 100)
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "product_materials", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "product_material")
    private List<Material> productMaterial;

    @Column(name = "product_desc", nullable = false)
    private String productDesc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_user_number")
    private BrandUser brandUser;

    // totalQuantity는 @PrePersist/@PreUpdate에서 자동 계산됨
    @Column(name = "total_quantity")
    private Long totalQuantity;

    @Builder.Default
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 100)
    private Set<ProductOption> productOptions = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 100)
    private Set<ProductSizeOption> productSizeOptions = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 100)
    private Set<ProductColorOption> productColorOptions = new HashSet<>();

    @Version
    @Column(name = "version")
    private Long version;

    /**
     * 업데이트 (PATCH) 도메인 메서드.
     * productId, brandUser, 총수량은 업데이트 대상에서 제외합니다.
     */
    public void updateFrom(ProductUpdateRequest updateRequest) {
        this.productCategory = updateRequest.getProductCategory().orElse(this.productCategory);
        this.productName = updateRequest.getProductName().orElse(this.productName);
        this.productPrice = updateRequest.getProductPrice().orElse(this.productPrice);
        this.productMaterial = updateRequest.getProductMaterial().orElse(this.productMaterial);
        this.productDesc = updateRequest.getProductDesc().orElse(this.productDesc);
        // totalQuantity는 @PrePersist/@PreUpdate에서 자동 계산됨

        updateCollection(
                updateRequest.getProductOptions(),
                this.productOptions,
                optUpdate -> t -> t.getId().getProductSize().name().equals(optUpdate.getProductSize())
                        && t.getId().getProductColor().name().equals(optUpdate.getProductColor()),
                (existingOption, optUpdate) -> existingOption.updateFrom(optUpdate)
        );

        updateCollection(
                updateRequest.getProductSizeOptions(),
                this.productSizeOptions,
                sizeUpdate -> t -> t.getId().getProductSize().name().equals(sizeUpdate.getProductSize()),
                (existingSizeOption, sizeUpdate) -> existingSizeOption.updateFrom(sizeUpdate)
        );

        updateCollection(
                updateRequest.getProductColorOptions(),
                this.productColorOptions,
                colorUpdate -> t -> t.getId().getProductColor().name().equals(colorUpdate.getProductColor()),
                (existingColorOption, colorUpdate) -> existingColorOption.updateFrom(colorUpdate)
        );
    }

    private <T, U> void updateCollection(Optional<List<U>> updateList, Collection<T> targetCollection,
                                         Function<U, Predicate<T>> matcher, BiConsumer<T, U> updater) {
        updateList.ifPresent(list ->
                list.forEach(u -> targetCollection.stream()
                        .filter(matcher.apply(u))
                        .findFirst()
                        .ifPresentOrElse(
                                t -> updater.accept(t, u),
                                () -> {
                                    // 신규 추가 로직 구현 가능 (현재는 생략)
                                }
                        ))
        );
    }

    public void addProductOption(ProductOption option) {
        option.assignProduct(this);
        this.productOptions.add(option);
    }


    public void addProductSizeOption(ProductSizeOption sizeOption) {
        sizeOption.assignProduct(this);
        this.productSizeOptions.add(sizeOption);
    }

    public void addProductColorOption(ProductColorOption colorOption) {
        colorOption.assignProduct(this);
        this.productColorOptions.add(colorOption);
    }

    public Set<ProductOption> getProductOptions() {
        return Collections.unmodifiableSet(productOptions);
    }

    public Set<ProductSizeOption> getProductSizeOptions() {
        return Collections.unmodifiableSet(productSizeOptions);
    }

    public Set<ProductColorOption> getProductColorOptions() {
        return Collections.unmodifiableSet(productColorOptions);
    }
}
