package basilium.basiliumserver.domain.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Normalized;

@Getter@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NormalUserInfoDTO {
    NormalUser user;
    DeliveryInfo deliveryInfo;
}
