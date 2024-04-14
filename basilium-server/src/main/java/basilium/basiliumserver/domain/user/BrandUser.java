package basilium.basiliumserver.domain.user;


import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class BrandUser extends User{
    private String firmName;
    private String firmAddress;
    private String businessRegistration;
    private String firmWebUrl;
}
