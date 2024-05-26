package basilium.basiliumserver.domain.shoppingCart;

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


@Entity
@Getter
@Setter
@NoArgsConstructor
public class ShoppingCart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @SequenceGenerator(name = "shopping_cart_sequence", sequenceName = "SHOPPING_CART_SEQUENCE", allocationSize = 1)
    @Column(name = "shopping_cart_id", nullable = false, columnDefinition = "int")
    Long shoppingCartId;

    @ManyToOne
    @JoinColumn(name = "userNumber")
    NormalUser normalUser;

    @ManyToOne
    @JoinColumn(name = "product_id")
    Product product;

    @Column(name = "color")
    String color;

    @Column(name = "size")
    String size;

    @Column(name = "amount")
    Long amount;

}
