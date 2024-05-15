package basilium.basiliumserver.order;

import basilium.basiliumserver.domain.product.Product;
import basilium.basiliumserver.domain.user.NormalUser;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Entity
@Getter
@Table(name = "orders")
@NoArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long price;
    //@OneToOne(fetch = FetchType.LAZY)
    //여러 주문이 존재하고 여러 상품이 연결될수있다.
    @ManyToMany(fetch = FetchType.EAGER)
    private List<Product> products; // 상품 목록
    //@OneToOne(fetch = FetchType.LAZY)
    //한 사용자는 한개의 주문을 가진다.(주문안에 여러 상품)
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "userNumber")
    private NormalUser normalUser; // 유저이름
    private String orderUid; // 주문 번호
    OrderStatus orderStatus;

    @Builder
    public Order(List<Product> products, String orderUid, NormalUser normalUser) {
        this.products = products;
        this.orderUid = orderUid;
        this.normalUser = normalUser;
        calculateTotalPrice(); // 총 주문 가격 계산
    }

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        String year = String.valueOf(now.getYear());
        String time = now.format(DateTimeFormatter.ofPattern("HHmmss"));
        this.orderUid = year + time ; //현재 달도 넣기
    }


    // 총 주문 가격 계산
    public void calculateTotalPrice() {
        if (products != null && !products.isEmpty()) {
            this.price = products.stream().mapToLong(Product::getProductPrice).sum();
        } else {
            this.price = 0L;
        }
    }


    // 상품 목록 설정 메서드
    public void setProducts(List<Product> products) {
        this.products = products;
        calculateTotalPrice();
    }

}
