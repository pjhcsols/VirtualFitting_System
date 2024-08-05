package basilium.basiliumserver.domain.payment;

import basilium.basiliumserver.domain.product.Product;
import basilium.basiliumserver.domain.user.NormalUser;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;


@Entity
@Getter @Setter
@NoArgsConstructor
@ToString
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @SequenceGenerator(name = "transaction_sequence", sequenceName = "TRANSACTION_SEQUENCE", allocationSize = 1)
    @Column(name = "transaction_id", nullable = false, columnDefinition = "int")
    Long transactionId;

    @Column(name = "imp_Uid")
    String impUId;

    @ManyToOne
    @JoinColumn(name = "userNumber")
    NormalUser normalUser;

    @ManyToOne
    @JoinColumn(name = "product_id")
    Product product;

    @Column(name = "color")
    String color;

    @Column(name ="size")
    String size;

    @Column(name = "total_cnt")
    Long totalCnt; //product 객체 totalQuantity 총수량 - totalcnt(purchase는 사이즈와 수량이 동일한 경우 같은 객체의 수량으로 취급)

    @Column(name = "payment_type")
    String paymentType;

    @CreationTimestamp
    @Column(name = "transaction_creation_time")
    LocalDateTime creationTime;

}
