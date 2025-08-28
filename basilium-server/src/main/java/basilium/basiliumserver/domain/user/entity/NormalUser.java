// src/main/java/basilium/basiliumserver/domain/user/entity/NormalUser.java
package basilium.basiliumserver.domain.user.entity;

import basilium.basiliumserver.domain.user.dto.NormalUserModifiedInfo;
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
    /** 호환용 DTO 생성자 */
    public NormalUser(NormalUserSignupDTO dto) {
        super(dto.getId(), dto.getPassword(), dto.getEmailAddress(), dto.getPhoneNumber(),
                Grade.BRONZE, Provider.NORMAL);
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

    /** 서비스에서 해시된 비번 등 가공값을 직접 주입하는 생성자 */
    public NormalUser(
            String id, String hashedPassword, String emailAddress, String phoneNumber,
            String name, String nickname, Gender gender, LocalDateTime birthDate, String address,
            Long totalLength, Long chest, Long shoulder, Long arm,
            Long pantsTotalLength, Long waistWidth, Long hipWidth, Long thighWidth,
            Long rise, Long hemWidth, Integer height, Integer weight
    ) {
        super(id, hashedPassword, emailAddress, phoneNumber, Grade.BRONZE, Provider.NORMAL);
        this.name      = name;
        this.nickname  = nickname;
        this.gender    = gender;
        this.birthDate = birthDate;
        this.address   = address;

        this.totalLength      = totalLength;
        this.chest            = chest;
        this.shoulder         = shoulder;
        this.arm              = arm;
        this.pantsTotalLength = pantsTotalLength;
        this.waistWidth       = waistWidth;
        this.hipWidth         = hipWidth;
        this.thighWidth       = thighWidth;
        this.rise             = rise;
        this.hemWidth         = hemWidth;
        this.height           = height;
        this.weight           = weight;
    }

    /** 수정: Optional 기반, 값이 존재할 때만 변경 */
    public void updateFrom(NormalUserModifiedInfo info) {
        info.getId().ifPresent(v -> { if (!Objects.equals(v, getId())) setId(v); });

        // 비밀번호는 서비스에서 이미 해시로 교체된 상태로 전달됨
        info.getPassword().ifPresent(v -> { if (!Objects.equals(v, getPassword())) setPassword(v); });

        info.getEmailAddress().ifPresent(v -> { if (!Objects.equals(v, getEmailAddress())) setEmailAddress(v); });
        info.getPhoneNumber().ifPresent(v -> { if (!Objects.equals(v, getPhoneNumber())) setPhoneNumber(v); });

        info.getName().ifPresent(v -> { if (!Objects.equals(v, this.name)) this.name = v; });
        info.getNickname().ifPresent(v -> { if (!Objects.equals(v, this.nickname)) this.nickname = v; });
        info.getBirthDate().ifPresent(v -> { if (!Objects.equals(v, this.birthDate)) this.birthDate = v; });
        info.getAddress().ifPresent(v -> { if (!Objects.equals(v, this.address)) this.address = v; });

        info.getTotalLength().ifPresent(v -> { if (!Objects.equals(v, this.totalLength)) this.totalLength = v; });
        info.getChest().ifPresent(v -> { if (!Objects.equals(v, this.chest)) this.chest = v; });
        info.getShoulder().ifPresent(v -> { if (!Objects.equals(v, this.shoulder)) this.shoulder = v; });
        info.getArm().ifPresent(v -> { if (!Objects.equals(v, this.arm)) this.arm = v; });

        info.getPantsTotalLength().ifPresent(v -> { if (!Objects.equals(v, this.pantsTotalLength)) this.pantsTotalLength = v; });
        info.getWaistWidth().ifPresent(v -> { if (!Objects.equals(v, this.waistWidth)) this.waistWidth = v; });
        info.getHipWidth().ifPresent(v -> { if (!Objects.equals(v, this.hipWidth)) this.hipWidth = v; });
        info.getThighWidth().ifPresent(v -> { if (!Objects.equals(v, this.thighWidth)) this.thighWidth = v; });
        info.getRise().ifPresent(v -> { if (!Objects.equals(v, this.rise)) this.rise = v; });
        info.getHemWidth().ifPresent(v -> { if (!Objects.equals(v, this.hemWidth)) this.hemWidth = v; });

        info.getHeight().ifPresent(v -> { if (!Objects.equals(v, this.height)) this.height = v; });
        info.getWeight().ifPresent(v -> { if (!Objects.equals(v, this.weight)) this.weight = v; });
    }
}
