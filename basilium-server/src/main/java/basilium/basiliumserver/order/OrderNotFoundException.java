package basilium.basiliumserver.order;

// 주문이 찾을 수 없는 예외 클래스
class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(String message) {
        super(message);
    }
}
