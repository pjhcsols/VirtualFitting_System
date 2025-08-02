package basilium.basiliumserver.domain.user.entity;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

//name, 직책
// 일반 유저의 등급 변화 가능해야됨
// 브랜드 유저의 등급 변화 가능해야됨
// 브랜드 유저에게 상품 판매 권한과 막기 줘야됨
// 브랜드 유저의 사업자 등록증을 삭제+디비 컬럼을 비우게 하고 재등록하는 기능을 할수있어야된다
// 광고 배너 이미지 url 컬럼을 만들고 이미지 스토리지도 추가해야됨
/*
-브랜드 유저 허락 권한
스토어페이지에 슬라이드 이미지에 admin 어트리뷰트 추가
// 일반 유저의 등급 변화 수정 가능해야됨
// 브랜드 유저의 등급 변화 가능해야됨
 */

@Getter
@Setter
@Entity
public class SuperUser extends User {
    //직책
    //부서
    //담당직무
    // 광고 배너 이미지 url 컬럼을 만들고 이미지 스토리지도 추가해야됨

    public SuperUser() {

        super();
    }

    public SuperUser(String id, String pwd, String email, String phone) {
        super(id, pwd, email, phone, Grade.SUPER, Provider.SUPER);
    }
}
