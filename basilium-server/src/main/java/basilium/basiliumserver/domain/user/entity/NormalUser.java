// src/main/java/basilium/basiliumserver/domain/user/entity/NormalUser.java
package basilium.basiliumserver.domain.user.entity;

import basilium.basiliumserver.domain.user.dto.UserModifiedInfo;
import basilium.basiliumserver.domain.user.dto.NormalUserSignupDTO;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "normal_user")
@DynamicUpdate
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Getter @Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NormalUser extends User {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, updatable = false)
    private Gender gender;

    @Column(nullable = false)
    private LocalDateTime birthDate;

    @Column(nullable = false)
    private String address;

    // --- 선택 치수 정보 ---
    private Long totalLength;
    private Long chest;
    private Long shoulder;
    private Long arm;

    private Long pantsTotalLength; //총장
    private Long waistWidth; //허리단면
    private Long hipWidth; //엉덩이단면
    private Long thighWidth; //허벅지단면
    private Long rise; //밑위
    private Long hemWidth; //밑단단면

    private Integer height;
    private Integer weight;

    /**
     * 가입용 생성자: DTO → Entity,
     * Grade.BRONZE·Provider.NORMAL 자동 세팅
     */
    public NormalUser(NormalUserSignupDTO dto) {
        super(dto.getId(),
                dto.getPassword(),
                dto.getEmailAddress(),
                dto.getPhoneNumber(),
                Grade.BRONZE,
                Provider.NORMAL);

        this.name      = dto.getName();
        this.nickname  = dto.getNickname();
        this.gender    = dto.getGender();
        this.birthDate = dto.getBirthDate();
        this.address   = dto.getAddress();

        this.totalLength      = dto.getTotalLength();
        this.chest            = dto.getChest();
        this.shoulder         = dto.getShoulder();
        this.arm              = dto.getArm();
        this.pantsTotalLength = dto.getPantsTotalLength();
        this.waistWidth       = dto.getWaistWidth();
        this.hipWidth         = dto.getHipWidth();
        this.thighWidth       = dto.getThighWidth();
        this.rise             = dto.getRise();
        this.hemWidth         = dto.getHemWidth();
        this.height           = dto.getHeight();
        this.weight           = dto.getWeight();
    }

    /**
     * 수정용 메서드: DTO 의 non-null·변경된 필드만 갱신
     */
    public void updateFrom(UserModifiedInfo info) {
        if (info.getName() != null && !Objects.equals(info.getName(), this.name))
            this.name = info.getName();

        if (info.getNickname() != null && !Objects.equals(info.getNickname(), this.nickname))
            this.nickname = info.getNickname();

        if (info.getPassword() != null && !Objects.equals(info.getPassword(), getPassword()))
            setPassword(info.getPassword());

        if (info.getEmailAddress() != null && !Objects.equals(info.getEmailAddress(), getEmailAddress()))
            setEmailAddress(info.getEmailAddress());

        if (info.getPhoneNumber() != null && !Objects.equals(info.getPhoneNumber(), getPhoneNumber()))
            setPhoneNumber(info.getPhoneNumber());

        if (info.getBirthDate() != null && !Objects.equals(info.getBirthDate(), this.birthDate))
            this.birthDate = info.getBirthDate();

        if (info.getAddress() != null && !Objects.equals(info.getAddress(), this.address))
            this.address = info.getAddress();

        if (info.getTotalLength() != null && !Objects.equals(info.getTotalLength(), this.totalLength))
            this.totalLength = info.getTotalLength();

        if (info.getChest() != null && !Objects.equals(info.getChest(), this.chest))
            this.chest = info.getChest();

        if (info.getShoulder() != null && !Objects.equals(info.getShoulder(), this.shoulder))
            this.shoulder = info.getShoulder();

        if (info.getArm() != null && !Objects.equals(info.getArm(), this.arm))
            this.arm = info.getArm();

        if (info.getPantsTotalLength() != null && !Objects.equals(info.getPantsTotalLength(), this.pantsTotalLength))
            this.pantsTotalLength = info.getPantsTotalLength();

        if (info.getWaistWidth() != null && !Objects.equals(info.getWaistWidth(), this.waistWidth))
            this.waistWidth = info.getWaistWidth();

        if (info.getHipWidth() != null && !Objects.equals(info.getHipWidth(), this.hipWidth))
            this.hipWidth = info.getHipWidth();

        if (info.getThighWidth() != null && !Objects.equals(info.getThighWidth(), this.thighWidth))
            this.thighWidth = info.getThighWidth();

        if (info.getRise() != null && !Objects.equals(info.getRise(), this.rise))
            this.rise = info.getRise();

        if (info.getHemWidth() != null && !Objects.equals(info.getHemWidth(), this.hemWidth))
            this.hemWidth = info.getHemWidth();

        if (info.getHeight() != null && !Objects.equals(info.getHeight(), this.height))
            this.height = info.getHeight();

        if (info.getWeight() != null && !Objects.equals(info.getWeight(), this.weight))
            this.weight = info.getWeight();
    }
}
