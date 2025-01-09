package basilium.basiliumserver.domain.user.entity;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class SuperUser extends User {
    public SuperUser() {

        super();
    }
}
