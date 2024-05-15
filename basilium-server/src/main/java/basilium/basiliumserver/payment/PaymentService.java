package basilium.basiliumserver.payment;



import basilium.basiliumserver.order.Order;
import basilium.basiliumserver.order.OrderRepository;
import basilium.basiliumserver.order.OrderStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PaymentService {
/*
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Transactional
    public void processPayment(Long orderId) {
        // 1. 주문 테이블에서 주문의 총 가격을 가져옵니다.
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없음"));
        Long totalPrice = order.getPrice();

        // 2. 아임포트 API를 호출하여 결제를 시도합니다.
        boolean paymentSuccess = callPaymentGateway(totalPrice);

        // 3. 결제가 성공하면 Payment 엔터티에 결제 정보를 저장하고 주문의 상태를 업데이트합니다.
        if (paymentSuccess) {
            Payment payment = new Payment();
            payment.setPrice(totalPrice);
            payment.setStatus(PaymentStatus.PAYMENT_COMPLETED);
            payment.setPaymentUid(generatePaymentUid());
            paymentRepository.save(payment);

            order.setStatus(OrderStatus.PAID);
            orderRepository.save(order);
        } else {
            // 4. 결제가 실패하면 실패 이유를 처리하고 Payment 엔터티의 상태를 업데이트합니다.
            Payment payment = new Payment();
            payment.setPrice(totalPrice);
            payment.setStatus(PaymentStatus.PAYMENT_FAILED);
            payment.setPaymentUid(generatePaymentUid());
            paymentRepository.save(payment);

            // 주문 상태를 실패로 업데이트
            order.setStatus(OrderStatus.PAYMENT_FAILED);
            orderRepository.save(order);
        }
    }

    // 아임포트 API 호출하는 가상의 메서드
    private boolean callPaymentGateway(Long totalPrice) {
        // 아임포트 API 호출 및 결제 처리 로직
        // 성공하면 true, 실패하면 false 반환
        return true; // 가상의 성공
    }

    // 결제 고유 번호 생성 메서드
    private String generatePaymentUid() {
        // 고유 번호 생성 로직
        return "PAYMENT-" + UUID.randomUUID().toString();
    }

 */
}
