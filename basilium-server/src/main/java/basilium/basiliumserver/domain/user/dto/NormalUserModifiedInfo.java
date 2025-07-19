// src/main/java/basilium/basiliumserver/domain/user/dto/NormalUserModifiedInfo.java
package basilium.basiliumserver.domain.user.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter @Setter
public class NormalUserModifiedInfo {
    private String        name;
    private String        emailAddress;
    private String        password;
    private String        phoneNumber;
    private String        nickname;
    private LocalDateTime birthDate;
    private String        address;

    private Long totalLength;
    private Long chest;
    private Long shoulder;
    private Long arm;
    private Long pantsTotalLength;
    private Long waistWidth;
    private Long hipWidth;
    private Long thighWidth;
    private Long rise;
    private Long hemWidth;
    private Integer height;
    private Integer weight;
}
