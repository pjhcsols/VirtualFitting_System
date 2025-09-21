// src/main/java/basilium/basiliumserver/domain/user/entity/SuperUser.java
package basilium.basiliumserver.domain.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.DynamicUpdate;

import java.util.ArrayList;
import java.util.List;

//변경된 칼럼만 UPDATE
@DynamicUpdate
// 테이블 분리 가능
@Entity
@Table(name = "super_user")
@Getter
@NoArgsConstructor
public class SuperUser extends User {

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 100)
    private String position;

    @Column(length = 100)
    private String department;

    @Column(length = 200)
    private String jobRole;

    /** 다중 배너 이미지 파일명(최대 10) */
    @BatchSize(size = 10)
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "superuser_banners",
            joinColumns = @JoinColumn(name = "user_number")
    )
    @Column(name = "banner_image_file_urls", length = 500)
    private List<String> bannerImageFileUrls = new ArrayList<>();

    public SuperUser(String id,
                     String pwd,
                     String email,
                     String phone,
                     String name,
                     String position,
                     String department,
                     String jobRole) {
        super(id, pwd, email, phone, Grade.SUPER, Provider.SUPER);
        this.name = name;
        this.position = position;
        this.department = department;
        this.jobRole = jobRole;
    }

    /** 가입·저장 직전에 권한 자동 설정 */
    @PrePersist
    private void prePersist() {
        setUserGrade(Grade.SUPER);
        setLoginType(Provider.SUPER);
    }

    /** 프로필 업데이트 (더티체킹) */
    public void updateAll(
            String newLoginId,
            String newEncodedPassword,
            String newEmail,
            String newPhone,
            String newName,
            String newPosition,
            String newDepartment,
            String newJobRole
    ) {
        // User(부모)의 보호(protected) 필드는 setter 없이 직접 갱신
        this.id           = newLoginId;
        this.password     = newEncodedPassword;
        this.emailAddress = newEmail;
        this.phoneNumber  = newPhone;

        this.name       = newName;
        this.position   = newPosition;
        this.department = newDepartment;
        this.jobRole    = newJobRole;
    }

    public void addBanner(String fileName) {
        this.bannerImageFileUrls.add(fileName);
    }

    public void removeBanner(String fileName) {
        this.bannerImageFileUrls.remove(fileName);
    }
}
