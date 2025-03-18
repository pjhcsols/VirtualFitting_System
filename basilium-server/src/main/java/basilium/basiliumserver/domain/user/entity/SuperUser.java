package basilium.basiliumserver.domain.user.entity;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

//name, 직책
@Getter
@Setter
@Entity
public class SuperUser extends User {
    public SuperUser() {

        super();
    }
}
