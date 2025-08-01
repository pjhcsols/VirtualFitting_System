package basilium.basiliumserver.domain.user.entity;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

//name, 직책
// 일반 유저의 등급 변화 가능해야됨
// 브랜드 유저의 등급 변화 가능해야됨
// 브랜드 유저에게 상품 판매 권한과 막기 줘야됨
// 브랜드 유저의 사업자 등록증을 삭제+디비 컬럼을 비우게 하고 재등록하는 기능을 할수있어야된다
@Getter
@Setter
@Entity
public class SuperUser extends User {
    public SuperUser() {

        super();
    }
}
