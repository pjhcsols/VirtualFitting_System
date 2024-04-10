package basilium.basiliumserver.domain.purchaseTransaction;

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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;


@Entity
@Getter @Setter
@NoArgsConstructor
public class PurchaseTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @SequenceGenerator(name = "transaction_sequence", sequenceName = "TRANSACTION_SEQUENCE", allocationSize = 1)
    @Column(name = "trasaction_id", nullable = false, columnDefinition = "int")
    Long transactionId;

    @ManyToOne
    @JoinColumn(name = "userNumber")
    NormalUser userId;

    @ManyToOne
    @JoinColumn(name = "product_id")
    Product productId;

    @Column(name = "total_cnt")
    Long totalCnt;

    @Column(name = "payment_type")
    String paymentType;
    
    @CreationTimestamp
    @Column(name = "transaction_creation_time")
    String creationTime;

}
