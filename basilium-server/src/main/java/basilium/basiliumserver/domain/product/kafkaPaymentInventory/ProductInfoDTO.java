package basilium.basiliumserver.domain.product.kafkaPaymentInventory;


//SSE 재고관리시 데이터 메시지 전송용
//@Data
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
/*

package basilium.basiliumserver.domain.product;

import lombok.Data; // 필요하면 사용하세요.

import java.io.Serializable;


 //* ProductInfoDTO is used for sending product-related information
 //* during stock management using Server-Sent Events (SSE).

public class ProductInfoDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long brandUserId;
    private Long productId;
    private Long totalQuantity;

     // Constructor for ProductInfoDTO.
     //
     // @param brandUserId the ID of the brand user.
     // @param productId the ID of the product.
     // @param totalQuantity the total quantity of the product.

    public ProductInfoDTO(Long brandUserId, Long productId, Long totalQuantity) {
        this.brandUserId = brandUserId;
        this.productId = productId;
        this.totalQuantity = totalQuantity;
    }

    // Getter and setter methods
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
*/