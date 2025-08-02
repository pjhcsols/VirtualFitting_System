package basilium.basiliumserver.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class MyBusinessCertDto {
    private final Long userNumber;
    private final String businessRegistration;
    private final String fileName;
    private final String url;
}