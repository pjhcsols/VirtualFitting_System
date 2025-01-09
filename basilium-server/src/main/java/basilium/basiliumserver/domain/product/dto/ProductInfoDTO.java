package basilium.basiliumserver.domain.product.dto;


//SSE 재고관리시 데이터 메시지 전송용
public class ProductInfoDTO {
    private Long brandUserId;
    private Long productId;
    private Long totalQuantity;

    public ProductInfoDTO(Long brandUserId, Long productId, Long totalQuantity) {
        this.brandUserId = brandUserId;
        this.productId = productId;
        this.totalQuantity = totalQuantity;
    }

    public Long getBrandUserId() {
        return brandUserId;
    }

    public void setBrandUserId(Long brandUserId) {
        this.brandUserId = brandUserId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(Long totalQuantity) {
        this.totalQuantity = totalQuantity;
    }
}
