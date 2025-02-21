package basilium.basiliumserver.domain.product.service;

import basilium.basiliumserver.domain.product.dto.ProductAllRetrieveDTO;
import basilium.basiliumserver.domain.product.dto.ProductInfoDTO;
import basilium.basiliumserver.domain.product.dto.ProductOptionDTO;
import basilium.basiliumserver.domain.product.dto.ProductUpdateRequest;
import basilium.basiliumserver.domain.product.entity.*;
import basilium.basiliumserver.domain.product.repository.ProductRepository;
import basilium.basiliumserver.domain.product.sse.SseController;
import basilium.basiliumserver.domain.user.entity.BrandUser;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;


@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // 헬퍼 메서드: 로깅과 예외 전달 (메시지를 한국어로 출력)
    private <T> T executeWithLogging(Supplier<T> supplier, String errorMessage) {
        try {
            return supplier.get();
        } catch (Exception e) {
            log.error(errorMessage, e);
            throw e;
        }
    }

    private void runWithLogging(Runnable runnable, String errorMessage) {
        try {
            runnable.run();
        } catch (Exception e) {
            log.error(errorMessage, e);
            throw e;
        }
    }

    /**
     * 상품 추가 (생성)
     */
    @Transactional
    public Product addProduct(Product product) {
        // 관계 설정이 반드시 필요
        product.getProductOptions().forEach(option -> option.assignProduct(product));
        product.getProductColorOptions().forEach(colorOption -> colorOption.assignProduct(product));
        product.getProductSizeOptions().forEach(sizeOption -> sizeOption.assignProduct(product));

        return executeWithLogging(() -> productRepository.save(product),
                "상품 추가 중 오류 발생: ");
    }

    /**
     * 상품 ID로 단건 조회 (Fetch Join)
     */
    // set

    @Transactional
    public Optional<Product> getProductDetailsByColor(Long productId, Color color) {
        return productRepository.findByIdAndColorWithRepresentativeImages(productId, color)
                .map(product -> {
                    // 각 ProductColorOption의 서브 이미지 컬렉션을 강제 로드 (빈 컬렉션이어도 size() 호출로 초기화)
                    product.getProductColorOptions().forEach(pc -> {
                        pc.getProductSubPhotoUrls().size();
                    });
                    // productMaterial도 강제 초기화
                    product.getProductMaterial().size();
                    return product;
                });
    }

    /**
     * 전체 상품 조회 (페이징 적용) 최적화하기 색상과 이미지 정렬 로직 추가
     */

    @Transactional
    public Page<ProductAllRetrieveDTO> getAllProducts(Pageable pageable) {
        Page<Product> productPage = productRepository.findAllWithDetails(pageable);

        return productPage.map(product -> {
            String categoryName = Optional.ofNullable(product.getProductCategory())
                    .map(cat -> cat.getCategoryName())
                    .orElse("");

            // productColorOptions는 이미 빈 컬렉션으로 초기화되어 있다고 가정
            var colorOptions = product.getProductColorOptions();

            // 각 ProductColorOption에서 색상(Enum)을 문자열로 추출하고 중복 제거
            List<String> colors = colorOptions.stream()
                    .map(colorOption -> colorOption.getId().getProductColor().name())
                    .distinct()
                    .sorted()
                    .toList();

            // 모든 ProductColorOption에서 productPhotoUrls를 flatMap으로 모아서 리스트 생성
            List<String> photoUrls = colorOptions.stream()
                    .flatMap(colorOption -> colorOption.getProductPhotoUrls().stream())
                    .sorted()
                    .toList();

            return new ProductAllRetrieveDTO(
                    product.getProductId(),
                    product.getProductName(),
                    product.getProductPrice(),
                    product.getTotalQuantity(),
                    categoryName,
                    colors,
                    photoUrls
            );
        });
    }


    /*
    @Transactional
    public Page<ProductAllRetrieveDTO> getAllProducts(Pageable pageable) {
        Page<ProductAllRetrieveDTO> productPage = productRepository.findAllWithDetails(pageable);

        // DTO 가공 (컬러 및 URL 중복 제거 및 정렬)
        return productPage.map(dto -> {
            List<String> distinctColors = dto.getProductColors().stream()
                    .distinct()
                    .sorted()
                    .collect(Collectors.toList());

            List<String> distinctPhotoUrls = dto.getProductPhotoUrls().stream()
                    .distinct()
                    .sorted()
                    .collect(Collectors.toList());

            return new ProductAllRetrieveDTO(
                    dto.getProductId(),
                    dto.getProductName(),
                    dto.getProductPrice(),
                    dto.getTotalQuantity(),
                    dto.getCategoryName(),
                    distinctColors,
                    distinctPhotoUrls
            );
        });
    }

     */

    /**
     * 상품 수정 (PATCH 방식: 부분 업데이트)
     */
    @Transactional
    public void updateProduct(Long productId, ProductUpdateRequest updateRequest) {
        runWithLogging(() -> {
            Product product = productRepository.findByIdWithDetails(productId)
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 상품 ID: " + productId));
            product.updateFrom(updateRequest);
        }, "상품 수정 중 오류 발생 (상품 ID: " + productId + "): ");
    }

    /**
     * 상품 옵션 수정 (개별 옵션 업데이트)
     */
    @Transactional
    public void updateProductOption(Long productId, ProductOptionDTO optionUpdate) {
        runWithLogging(() -> {
            Product product = productRepository.findByIdWithDetails(productId)
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 상품 ID: " + productId));
            product.getProductOptions().stream()
                    .filter(option -> option.getId().getProductSize().name().equals(optionUpdate.getProductSize()) &&
                            option.getId().getProductColor().name().equals(optionUpdate.getProductColor()))
                    .findFirst()
                    .ifPresentOrElse(
                            existingOption -> existingOption.updateQuantity(optionUpdate.getOptionQuantity()),
                            () -> { throw new IllegalArgumentException("수정할 상품 옵션을 찾을 수 없습니다."); }
                    );
        }, "상품 옵션 수정 중 오류 발생 (상품 ID: " + productId + "): ");
    }

    /**
     * 상품 옵션 삭제: productId와 옵션(색상, 사이즈) 기준으로 옵션 삭제
     */
    @Transactional
    public void deleteProductOption(Long productId, String productSize, String productColor) {
        runWithLogging(() -> {
            Product product = productRepository.findByIdWithDetails(productId)
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 상품 ID: " + productId));
            boolean removed = product.getProductOptions().removeIf(option ->
                    option.getId().getProductSize().name().equals(productSize) &&
                            option.getId().getProductColor().name().equals(productColor));
            if (!removed) {
                throw new IllegalArgumentException("삭제할 상품 옵션을 찾을 수 없습니다.");
            }
        }, "상품 옵션 삭제 중 오류 발생 (상품 ID: " + productId + "): ");
    }

    /**
     * 상품 옵션 추가: 한 상품에 대해 새로운 옵션 추가
     */
    @Transactional
    public void addProductOption(Long productId, ProductOptionDTO createRequest) {
        runWithLogging(() -> {
            Product product = productRepository.findByIdWithDetails(productId)
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 상품 ID: " + productId));
            boolean exists = product.getProductOptions().stream()
                    .anyMatch(option -> option.getId().getProductSize().name().equals(createRequest.getProductSize()) &&
                            option.getId().getProductColor().name().equals(createRequest.getProductColor()));
            if (exists) {
                throw new IllegalArgumentException("이미 존재하는 상품 옵션입니다.");
            }
            ProductOption newOption = ProductOption.builder()
                    .id(new ProductOptionId(
                            productId,
                            Enum.valueOf(Size.class, createRequest.getProductSize()),
                            Enum.valueOf(Color.class, createRequest.getProductColor())
                    ))
                    .optionQuantity(createRequest.getOptionQuantity())
                    .build();
            product.addProductOption(newOption);
        }, "상품 옵션 추가 중 오류 발생 (상품 ID: " + productId + "): ");
    }

    /**
     * 상품 삭제 (전체 상품 삭제)
     */
    @Transactional
    public void deleteProduct(Long productId) {
        runWithLogging(() -> productRepository.deleteById(productId),
                "상품 삭제 중 오류 발생 (상품 ID: " + productId + "): ");
    }

    /**
     * 전체 상품 수 조회
     */
    public long countProducts() {
        return executeWithLogging(() -> productRepository.count(),
                "상품 수 조회 중 오류 발생: ");
    }

    /**
     * 상품 이름에 특정 문자열이 포함된 상품 조회
     */
    public List<Product> getProductsByName(String name) {
        return executeWithLogging(() -> productRepository.findByProductNameContaining(name),
                "상품 이름 검색 중 오류 발생 (검색어: '" + name + "'): ");
    }

    /**
     * 상품 ID를 기반으로 관련 BrandUser 조회
     */
    public Optional<BrandUser> findBrandUserByProductId(Long productId) {
        return executeWithLogging(() -> productRepository.findBrandUserByProductId(productId),
                "상품에 연관된 브랜드 유저 조회 중 오류 발생 (상품 ID: " + productId + "): ");
    }

    /**
     * 카테고리 ID로 상품 목록 조회
     */
    public List<Product> findByCategoryId(Long categoryId) {
        return executeWithLogging(() -> productRepository.findByProductCategory_CategoryId(categoryId),
                "카테고리별 상품 조회 중 오류 발생 (카테고리 ID: " + categoryId + "): ");
    }

    /**
     * 스케줄러용: 전체 상품의 이미지 URL 목록 조회 (productColorOptions 사용)
     */
    @Transactional
    public List<String> getAllProductImageUrls() {
        return executeWithLogging(() -> {
            List<Product> products = productRepository.findAll();
            List<String> allImageUrls = new ArrayList<>();
            products.forEach(product ->
                    product.getProductColorOptions().forEach(colorOption -> {
                        allImageUrls.addAll(colorOption.getProductPhotoUrls());
                        allImageUrls.addAll(colorOption.getProductSubPhotoUrls());
                    })
            );
            return allImageUrls;
        }, "전체 상품 이미지 URL 조회 중 오류 발생: ");
    }

    /**
     * 결제 처리: 특정 옵션의 재고 차감 및 전체 재고 업데이트
     */
    @Transactional
    public void processPaymentProductQuantity(Long productId, Size productSize, Color productColor, Long purchaseQuantity) {
        runWithLogging(() -> {
            Product product = productRepository.findByIdWithDetails(productId)
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 상품 ID: " + productId));
            ProductOption option = product.getProductOptions().stream()
                    .filter(opt -> opt.getId().getProductSize().equals(productSize) &&
                            opt.getId().getProductColor().equals(productColor))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다."));
            if (option.getOptionQuantity() < purchaseQuantity) {
                throw new IllegalArgumentException("선택한 옵션의 재고가 부족합니다.");
            }
            option.updateQuantity(option.getOptionQuantity() - purchaseQuantity);
            log.info("[상품 재고 차감] 상품 ID: {}, 차감 수량: -{}", productId, purchaseQuantity);
            SseController.updateInventory(productId);
        }, "결제 처리 중 오류 발생 (상품 ID: " + productId + "): ");
    }

    /**
     * 상품 복구: 결제 시 차감된 수량 복구
     */
    @Transactional
    public void restoreProductQuantity(Long productId, Size productSize, Color productColor, Long count) {
        runWithLogging(() -> {
            Product product = productRepository.findByIdWithDetails(productId)
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 상품 ID: " + productId));
            ProductOption option = product.getProductOptions().stream()
                    .filter(opt -> opt.getId().getProductSize().equals(productSize) &&
                            opt.getId().getProductColor().equals(productColor))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다."));
            option.updateQuantity(option.getOptionQuantity() + count);
            SseController.updateInventory(productId);
        }, "상품 복구 중 오류 발생 (상품 ID: " + productId + "): ");
    }

    /**
     * SSE: 현재 상품 재고 조회
     */
    public Long getProductQuantity(Long productId) {
        return executeWithLogging(() -> {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 상품 ID: " + productId));
            return product.getTotalQuantity();
        }, "상품 재고 조회 중 오류 발생 (상품 ID: " + productId + "): ");
    }

    /**
     * SSE: 재고 변경 시 BrandUser 정보 전송용 DTO 반환
     */
    public ProductInfoDTO getProductInfo(Long productId) {
        return executeWithLogging(() -> {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 상품 ID: " + productId));
            Long brandUserId = product.getBrandUser().getUserNumber();
            Long totalQuantity = product.getTotalQuantity();
            return new ProductInfoDTO(brandUserId, productId, totalQuantity);
        }, "상품 정보 조회 중 오류 발생 (상품 ID: " + productId + "): ");
    }
}
