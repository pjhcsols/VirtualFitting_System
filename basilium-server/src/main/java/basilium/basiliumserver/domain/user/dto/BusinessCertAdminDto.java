package basilium.basiliumserver.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class BusinessCertAdminDto {
    private final Long userNumber;
    private final String userId;
    private final String fileName;
    private final String url;
}
