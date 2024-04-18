package basilium.basiliumserver.domain.user;

import basilium.basiliumserver.domain.user.User;
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
