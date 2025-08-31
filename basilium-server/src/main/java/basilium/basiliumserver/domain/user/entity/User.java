// src/main/java/basilium/basiliumserver/domain/user/entity/User.java
package basilium.basiliumserver.domain.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@MappedSuperclass
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public abstract class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_number")
    private Long userNumber;

    @Column(unique = true, nullable = false)
    protected String id;

    @Column(nullable = false)
    protected String password;

    @Column(unique = true, nullable = false)
    protected String emailAddress;

    @Column(unique = true, nullable = false)
    protected String phoneNumber;

    /** 0=BRONZE,1=SILVER… */
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false, columnDefinition = "TINYINT")
    private Grade userGrade;

    /** 0=NORMAL,1=BRAND,2=SUPER… */
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false, columnDefinition = "TINYINT")
    private Provider loginType;

    String userImageUrl;

    @Column(length = 500)
    String userProfileImageUrl;

    /**
     * 신규 가입 전용 생성자: Grade·Provider 기본값 주입
     */
    protected User(String id,
                   String password,
                   String emailAddress,
                   String phoneNumber,
                   Grade defaultGrade,
                   Provider defaultProvider) {
        this.id           = id;
        this.password     = password;
        this.emailAddress = emailAddress;
        this.phoneNumber  = phoneNumber;
        this.userGrade    = defaultGrade;
        this.loginType    = defaultProvider;
    }
}
