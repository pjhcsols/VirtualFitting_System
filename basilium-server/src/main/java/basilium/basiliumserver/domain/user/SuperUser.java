package basilium.basiliumserver.domain.user;

import basilium.basiliumserver.domain.user.User;
import jakarta.persistence.Entity;

@Entity
public class SuperUser extends User {
    public SuperUser() {

        super();
    }
}
