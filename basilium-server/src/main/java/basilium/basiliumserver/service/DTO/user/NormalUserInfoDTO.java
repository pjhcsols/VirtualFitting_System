package basilium.basiliumserver.service.DTO.user;

import basilium.basiliumserver.domain.deliveryInfo.DeliveryInfo;
import basilium.basiliumserver.domain.user.NormalUser;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NormalUserInfoDTO {
    NormalUser user;
    DeliveryInfo deliveryInfo;
}
