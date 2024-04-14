package basilium.basiliumserver.domain.like;

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
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.transaction.annotation.Transactional;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "like_history")
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @SequenceGenerator(name = "like_sequence", sequenceName = "LIKE_SEQUENCE", allocationSize = 1)
    @Column(name = "like_id", nullable = false, columnDefinition = "int")
    Long likeId;

    @ManyToOne
    @JoinColumn(name = "userNumber")
    NormalUser normalUser;

    @ManyToOne
    @JoinColumn(name = "product_id")
    Product product;
}
