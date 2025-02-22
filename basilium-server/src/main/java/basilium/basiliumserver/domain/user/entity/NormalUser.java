package basilium.basiliumserver.domain.user.entity;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class NormalUser extends User {
    private String name;
    private Date birthDate;
    private String address;


}
