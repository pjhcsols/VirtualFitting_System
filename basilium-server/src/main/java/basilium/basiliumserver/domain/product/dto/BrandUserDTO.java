package basilium.basiliumserver.domain.product.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BrandUserDTO {
    private Long userNumber;
    private String id;
    private String emailAddress;
    private String phoneNumber;
    private String userGrade;
    private String loginType;
    private String firmName;
    private String firmAddress;
    private String businessRegistration;
    private String firmWebUrl;
}
