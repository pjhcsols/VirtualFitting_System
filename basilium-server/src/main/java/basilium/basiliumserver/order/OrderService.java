package basilium.basiliumserver.order;

import basilium.basiliumserver.domain.product.Product;
import basilium.basiliumserver.domain.user.NormalUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // 주문 생성 메서드
    public Order createOrder(List<Product> products, NormalUser normalUser) {
        Order order = Order.builder()
                .normalUser(normalUser)
                .build();
        order.setProducts(products); // 상품 목록 설정
        return orderRepository.save(order);
    }

    // 주문 삭제 메서드
    public void deleteOrder(Long orderId) {
        orderRepository.deleteById(orderId);
    }

    // 주문 상품 수정 및 주문 가격 재계산 메서드
    public Order updateOrderProducts(Long orderId, List<Product> products) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));

        // 주문이 수정될 때 product 리스트가 비어있으면 해당 주문을 삭제함
        if (products.isEmpty()) {
            // 주문이 삭제될 때의 추가 작업 (예: 로그 기록 등)이 필요하다면 여기에 추가 가능
            orderRepository.delete(order);
            return null; // 빈 product 리스트로 주문을 수정한 경우 null을 반환하거나 다른 방식으로 처리할 수 있습니다.
        }

        order.setProducts(products);
        order.calculateTotalPrice(); // 주문 가격 재계산
        return orderRepository.save(order);
    }


    // 주문 목록 조회 메서드
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // 특정 유저의 주문 목록 조회 메서드
    public List<Order> getOrdersByUser(NormalUser normalUser) {
        return orderRepository.findByNormalUser(normalUser);
    }
}

