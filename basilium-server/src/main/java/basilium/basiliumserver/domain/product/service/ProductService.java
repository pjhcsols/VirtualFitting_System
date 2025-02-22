package basilium.basiliumserver.domain.product.service;

import basilium.basiliumserver.domain.product.dto.*;
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
import java.util.stream.Collectors;
import java.util.HashSet;


// 상품 id에 맞는 색상 보내주기
// 검색 필터링
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
    @Transactional
    public ProductDetailDTO getProductDetailsByColor(Long productId, Color color) {
        // 1. 기본 상품 정보 조회 (Fetch Join)
        Product product = productRepository.findByIdWithDetailsIdAndColor(productId)
                .orElseThrow(() -> new IllegalArgumentException("해당 상품을 찾을 수 없습니다. (상품 ID: " + productId + ")"));

        // 2. 방어적 복사: lazy 컬렉션을 일반 ArrayList로 복사
        List<Material> materials = new ArrayList<>(Optional.ofNullable(product.getProductMaterial())
                .orElseGet(ArrayList::new));

        // 요청한 색상에 해당하는 옵션만 필터링하여 DTO로 변환
        List<ProductOptionDTO> optionDTOs = Optional.ofNullable(product.getProductOptions())
                .orElseGet(() -> new HashSet<>())
                .stream()
                .filter(opt -> opt.getId().getProductColor().equals(color))
                .map(opt -> new ProductOptionDTO(
                        opt.getId().getProductSize().name(),
                        opt.getId().getProductColor().name(),
                        opt.getOptionQuantity()))
                .collect(Collectors.toList());

        // 요청한 색상의 옵션 재고 합계를 계산
        long totalColorQuantity = optionDTOs.stream()
                .mapToLong(ProductOptionDTO::getOptionQuantity)
                .sum();

        // 사이즈 옵션은 그대로 DTO로 변환
        List<ProductSizeOptionDTO> sizeOptionDTOs = Optional.ofNullable(product.getProductSizeOptions())
                .orElseGet(() -> new HashSet<>())
                .stream()
                .map(sizeOpt -> new ProductSizeOptionDTO(
                        sizeOpt.getId().getProductSize().name(),
                        sizeOpt.getTotalLength(),
                        sizeOpt.getChest(),
                        sizeOpt.getShoulder(),
                        sizeOpt.getArm()))
                .collect(Collectors.toList());

        // BrandUser 매핑
        BrandUserDTO brandUserDTO = Optional.ofNullable(product.getBrandUser())
                .map(bu -> new BrandUserDTO(
                        bu.getUserNumber(),
                        bu.getId(),
                        bu.getEmailAddress(),
                        bu.getPhoneNumber(),
                        bu.getUserGrade().name(),
                        bu.getLoginType().name(),
                        bu.getFirmName(),
                        bu.getFirmAddress(),
                        bu.getBusinessRegistration(),
                        bu.getFirmWebUrl()))
                .orElseGet(BrandUserDTO::new);

        // 3. 색상에 따른 이미지 데이터 조회 (별도 Repository 메서드 사용)
        ProductColorOption colorOption = productRepository.findProductColorOptionByProductIdAndColor(productId, color)
                .orElseThrow(() -> new IllegalArgumentException("해당 색상의 이미지 데이터를 찾을 수 없습니다. (색상: " + color + ")"));

        List<String> repUrls = new ArrayList<>(Optional.ofNullable(colorOption.getProductPhotoUrls())
                .orElseGet(ArrayList::new));
        List<String> subUrls = new ArrayList<>(Optional.ofNullable(colorOption.getProductSubPhotoUrls())
                .orElseGet(ArrayList::new));

        ProductImageDTO imageDTO = new ProductImageDTO(
                colorOption.getId().getProductColor().name(),
                repUrls,
                subUrls
        );

        // 4. 최종 DTO 생성 (생성자를 활용하여 모든 필드를 초기화)
        return new ProductDetailDTO(
                product.getProductId(),
                product.getProductName(),
                product.getProductPrice(),
                product.getProductDesc(),
                materials,
                Optional.ofNullable(product.getProductCategory())
                        .map(cat -> cat.getCategoryName())
                        .orElse(""),
                brandUserDTO,
                totalColorQuantity, // 요청한 색상의 옵션 재고 합계
                optionDTOs,
                sizeOptionDTOs,
                imageDTO
        );
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

    /**
     * 상품 수정 (PATCH 방식: 부분 업데이트)
     */
    /*
    @Transactional
    public void updateProduct(Long productId, ProductUpdateRequest updateRequest) {
        runWithLogging(() -> {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 상품 ID: " + productId));
            product.updateFrom(updateRequest);
        }, "상품 수정 중 오류 발생 (상품 ID: " + productId + "): ");
    }
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
