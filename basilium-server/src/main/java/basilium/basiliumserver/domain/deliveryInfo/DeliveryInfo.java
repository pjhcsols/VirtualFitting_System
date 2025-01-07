package basilium.basiliumserver.domain.deliveryInfo;


import basilium.basiliumserver.domain.user.NormalUser;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="delivery_info_id")
    Long deliveryInfoId;

    @OneToOne
    @JoinColumn(name="user_number")
    NormalUser normalUser;

    @Column(name="default_delivery_address")
    String defaultDeliveryAddress;

    @Column(name="first_delivery_address")
    String firstDeliveryAddress;

    @Column(name="second_delivery_address")
    String second_delivery_address;

}
