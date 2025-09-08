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

//@OptimisticeLocking
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

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "varchar(20) default 'ON_SALE'")
    private ProductStatus status = ProductStatus.ON_SALE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category productCategory;

    //50자
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

    //255글자
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

    @Builder.Default
    @Version
    @Column(name = "version", nullable = false, columnDefinition = "bigint default 0")
    private Long version = 0L;

    /**
     * 업데이트 (PATCH) 도메인 메서드.
     * productId, brandUser, 총수량은 업데이트 대상에서 제외합니다.
     */
    //===========================
    // (1) updateFrom: 기본 필드 Optional 업데이트 + 컬렉션 증분 동기화
    //===========================
    public void updateFrom(ProductUpdateRequest req) {
        // — 기본 필드만 Optional 업데이트 —
        this.productCategory = req.getProductCategory().orElse(this.productCategory);
        this.productName     = req.getProductName().orElse(this.productName);
        this.productPrice    = req.getProductPrice().orElse(this.productPrice);
        this.productMaterial = req.getProductMaterial().orElse(this.productMaterial);
        this.productDesc     = req.getProductDesc().orElse(this.productDesc);
        // totalQuantity는 @PrePersist/@PreUpdate에서 자동 계산됨

        // — 옵션 컬렉션 증분 동기화 —
        syncCollection(
                req.getProductOptions(),        // Optional<List<ProductOptionDTO>>
                this.productOptions,            // 기존 Set<ProductOption>
                dto -> existing ->
                        existing.getId().getProductSize().name().equals(dto.getProductSize()) &&
                                existing.getId().getProductColor().name().equals(dto.getProductColor()),  // 매칭 조건
                (existingOpt, dto) -> { // updater: “같은 엔티티”일 경우
                    if (!Objects.equals(existingOpt.getOptionQuantity(), dto.getOptionQuantity())) {
                        existingOpt.updateQuantity(dto.getOptionQuantity());
                    }
                },
                dto -> { // entityFactory: “새로운 DTO → 신규 엔티티 생성”
                    ProductOption newOpt = ProductOption.builder()
                            .id(new ProductOptionId(
                                    this.productId,
                                    Size.valueOf(dto.getProductSize()),
                                    Color.valueOf(dto.getProductColor())
                            ))
                            .optionQuantity(dto.getOptionQuantity())
                            .build();
                    newOpt.assignProduct(this);
                    return newOpt;
                }
        );

        // — 사이즈 옵션 컬렉션 증분 동기화 —
        syncCollection(
                req.getProductSizeOptions(),     // Optional<List<ProductSizeOptionDTO>>
                this.productSizeOptions,         // 기존 Set<ProductSizeOption>
                dto -> existing ->
                        existing.getId().getProductSize().name().equals(dto.getProductSize()),
                (existingSz, dto) -> { // updater
                    if (!Objects.equals(existingSz.getTotalLength(), dto.getTotalLength()) ||
                            !Objects.equals(existingSz.getChest(), dto.getChest()) ||
                            !Objects.equals(existingSz.getShoulder(), dto.getShoulder()) ||
                            !Objects.equals(existingSz.getArm(), dto.getArm())) {
                        existingSz.updateFrom(dto);
                    }
                },
                dto -> { // entityFactory
                    ProductSizeOption newSz = ProductSizeOption.builder()
                            .id(new ProductSizeOptionId(
                                    this.productId,
                                    Size.valueOf(dto.getProductSize())
                            ))
                            .totalLength(dto.getTotalLength())
                            .chest(dto.getChest())
                            .shoulder(dto.getShoulder())
                            .arm(dto.getArm())
                            .build();
                    newSz.assignProduct(this);
                    return newSz;
                }
        );

        // — 색상 옵션 + 이미지 컬렉션 증분 동기화 —
        syncCollection(
                req.getProductColorOptions(),    // Optional<List<ProductColorOptionDTO>>
                this.productColorOptions,        // 기존 Set<ProductColorOption>
                dto -> existing ->
                        existing.getId().getProductColor().name().equals(dto.getProductColor()),
                (existingCol, dto) -> { // updater
                    if (!existingCol.getProductPhotoUrls().equals(dto.getProductPhotoUrls()) ||
                            !existingCol.getProductSubPhotoUrls().equals(dto.getProductSubPhotoUrls())) {
                        existingCol.updateFrom(dto);
                    }
                },
                dto -> { // entityFactory
                    ProductColorOption newCol = ProductColorOption.builder()
                            .id(new ProductColorOptionId(
                                    this.productId,
                                    Color.valueOf(dto.getProductColor())
                            ))
                            .productPhotoUrls(new ArrayList<>(dto.getProductPhotoUrls()))
                            .productSubPhotoUrls(new ArrayList<>(dto.getProductSubPhotoUrls()))
                            .build();
                    newCol.assignProduct(this);
                    return newCol;
                }
        );
    }

    //===================================================
    // (2) syncCollection: “증분 동기화”를 수행하는 제네릭 헬퍼 메서드
    //===================================================
    /**
     * @param dtoListOpt          Optional<List<U>>: 들어온 전체 DTO 리스트(예: ProductOptionDTO 등)
     * @param existingEntities    현재 엔티티의 컬렉션(Set<T> 등)
     * @param matcher             (U → Predicate<T>): “DTO와 매칭되는 엔티티인가?”
     * @param updater             (T,U) → void: “같은 엔티티로 판명되었을 때 수정할 로직”
     * @param entityFactory       (U → T): “신규 DTO인 경우 새로운 엔티티 인스턴스를 생성하는 로직”
     */
    private <T, U> void syncCollection(
            Optional<List<U>> dtoListOpt,
            Collection<T> existingEntities,
            Function<U, Predicate<T>> matcher,
            BiConsumer<T, U> updater,
            Function<U, T> entityFactory
    ) {
        if (dtoListOpt.isEmpty()) {
            // 요청에 해당 DTO 리스트가 아예 없으면(즉, Optional.empty()) 아무 작업도 하지 않음
            return;
        }

        List<U> dtoList = dtoListOpt.get();

        // 1) 들어온 DTO 하나하나를 보면서,
        //    - 기존 엔티티에 매칭되는 게 있으면 updater 실행
        //    - 매칭되는 게 없으면 entityFactory로 신규 엔티티 생성 후 추가
        for (U dto : dtoList) {
            Predicate<T> predicate = matcher.apply(dto);
            Optional<T> existing = existingEntities.stream().filter(predicate).findFirst();

            if (existing.isPresent()) {
                // 이미 있는 엔티티 → 값이 변경되었으면 update
                updater.accept(existing.get(), dto);
            } else {
                // 없는 엔티티 → 새로 생성해서 컬렉션에 추가
                existingEntities.add(entityFactory.apply(dto));
            }
        }

        // 2) “요청 리스트에 없는 기존 엔티티”는 컬렉션에서 제거(DELETE)
        existingEntities.removeIf(entity ->
                dtoList.stream()
                        .map(matcher)          // 각 DTO → 그 DTO와 매칭되는 조건(Predicate<T>)
                        .noneMatch(pred -> pred.test(entity))
        );
    }

    public void changeStatus(ProductStatus newStatus) {
        this.status = newStatus;
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

    @PrePersist
    @PreUpdate
    private void calculateTotalQuantity() {
        this.totalQuantity = Optional.ofNullable(productOptions)
                .orElseGet(java.util.Set::of)
                .stream()
                .mapToLong(ProductOption::getOptionQuantity)
                .sum();
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
