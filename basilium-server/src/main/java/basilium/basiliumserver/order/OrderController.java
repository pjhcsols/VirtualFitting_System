package basilium.basiliumserver.order;


import basilium.basiliumserver.domain.user.NormalUser;
import basilium.basiliumserver.service.user.NormalUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import basilium.basiliumserver.domain.product.Product;

//주문으로 결제가 완료되면 주문정보를 저장하고있고
//아니면 스케줄링으로 삭제 /판별기준 객체에 enum으로 결제 완료시에 정보수정시키기
@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private NormalUserService normalUserService;


    // 주문 생성 API
    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest request) {
        Order order = orderService.createOrder(request.getProducts(), request.getNormalUser());
        return ResponseEntity.ok(order);
    }

    // 주문 삭제 API
    @DeleteMapping("/delete/{orderId}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.ok("Order with ID: " + orderId + " deleted successfully.");
    }

    // 주문 상품 수정 API
    @PutMapping("/update/{orderId}")
    public ResponseEntity<?> updateOrderProducts(@PathVariable Long orderId, @RequestBody List<Product> products) {
        Order updatedOrder = orderService.updateOrderProducts(orderId, products);

        if (updatedOrder == null) {
            return ResponseEntity.notFound().build(); // 주문이 삭제된 경우 404 응답을 반환
        } else if (updatedOrder.getProducts().isEmpty()) {
            // 주문이 비어서 삭제된 경우
            orderService.deleteOrder(orderId); // 주문 삭제
            return ResponseEntity.ok("Order with ID " + orderId + " has been deleted because it is empty."); // 삭제된 메시지 반환
        }

        return ResponseEntity.ok("Order with ID " + orderId + " has been successfully updated."); // 주문이 정상적으로 업데이트된 경우 메시지 반환
    }


    // 주문 목록 전부 조회
    @GetMapping("/alllist")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // 특정 유저의 주문 목록 조회 API
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable String userId) {
        NormalUser normalUser = normalUserService.userInfoById(userId); // 사용자 ID로 사용자 객체를 가져옴
        if (normalUser == null) {
            return ResponseEntity.notFound().build(); // 사용자를 찾을 수 없는 경우 404 응답을 반환
        }

        List<Order> orders = orderService.getOrdersByUser(normalUser); // 사용자의 주문 목록을 조회
        return ResponseEntity.ok(orders);
    }


    // 예외 처리
    @ExceptionHandler
    public ResponseEntity<String> handleException(OrderNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
    }
}


