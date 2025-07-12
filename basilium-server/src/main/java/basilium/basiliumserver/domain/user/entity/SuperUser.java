package basilium.basiliumserver.domain.user.entity;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

//name, 직책
// 일반 유저의 등급 변화 가능해야됨
// 브랜드 유저의 등급 변화 가능해야됨
@Getter
@Setter
@Entity
public class SuperUser extends User {
    public SuperUser() {

        super();
    }
}
