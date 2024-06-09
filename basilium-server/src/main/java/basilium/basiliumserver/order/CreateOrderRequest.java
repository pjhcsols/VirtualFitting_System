package basilium.basiliumserver.order;

import basilium.basiliumserver.domain.product.Product;
import basilium.basiliumserver.domain.user.NormalUser;
import lombok.Data;

import java.util.List;

// 주문 생성 요청 DTO 클래스
@Data
public class CreateOrderRequest {
    private List<Product> products;
    private NormalUser normalUser;
}
