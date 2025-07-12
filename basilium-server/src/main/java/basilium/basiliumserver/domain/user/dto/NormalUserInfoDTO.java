// src/main/java/basilium/basiliumserver/domain/user/dto/NormalUserInfoDTO.java
package basilium.basiliumserver.domain.user.dto;

import basilium.basiliumserver.domain.deliveryInfo.DeliveryInfo;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import lombok.Getter;

@Getter
public class NormalUserInfoDTO {
    private final String        id;
    private final String        emailAddress;
    private final String        phoneNumber;
    private final String        name;
    private final String        nickname;
    private final String        gender;
    private final java.time.LocalDateTime birthDate;
    private final String        address;
    private final Long          totalLength;
    private final Long          chest;
    private final Long          shoulder;
    private final Long          arm;
    private final Long          pantsTotalLength;
    private final Long          waistWidth;
    private final Long          hipWidth;
    private final Long          thighWidth;
    private final Long          rise;
    private final Long          hemWidth;
    private final Integer       height;
    private final Integer       weight;
    private final DeliveryInfo  deliveryInfo;

    public NormalUserInfoDTO(NormalUser u, DeliveryInfo d) {
        this.id               = u.getId();
        this.emailAddress     = u.getEmailAddress();
        this.phoneNumber      = u.getPhoneNumber();
        this.name             = u.getName();
        this.nickname         = u.getNickname();
        this.gender           = u.getGender().name();
        this.birthDate        = u.getBirthDate();
        this.address          = u.getAddress();
        this.totalLength      = u.getTotalLength();
        this.chest            = u.getChest();
        this.shoulder         = u.getShoulder();
        this.arm              = u.getArm();
        this.pantsTotalLength = u.getPantsTotalLength();
        this.waistWidth       = u.getWaistWidth();
        this.hipWidth         = u.getHipWidth();
        this.thighWidth       = u.getThighWidth();
        this.rise             = u.getRise();
        this.hemWidth         = u.getHemWidth();
        this.height           = u.getHeight();
        this.weight           = u.getWeight();
        this.deliveryInfo     = d;
    }
}
