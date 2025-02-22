package basilium.basiliumserver.domain.user.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter@Setter
@RequiredArgsConstructor
public class UserModifiedInfo {
    String name;
    String emailAddress;
    String password;
    String phoneNumber;
}
