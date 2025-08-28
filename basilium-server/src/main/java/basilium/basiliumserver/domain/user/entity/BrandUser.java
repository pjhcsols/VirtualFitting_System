// src/main/java/basilium/basiliumserver/domain/user/entity/BrandUser.java
package basilium.basiliumserver.domain.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class BrandUser extends User {
    @Column(name = "firm_name", nullable = false)
    private String firmName;

    @Column(nullable = false)
    private String firmAddress;

    @Column(name = "business_registration", nullable = false)
    private String businessRegistration;

    @Column(length = 500)
    private String businessRegistrationCertificateImageUrl;

    @Column(length = 500)
    private String firmWebUrl;

    @Column(nullable = false)
    private String firmEmail;

    @Column(nullable = false)
    private String firmPhone;

    /** 판매 가능 여부. 등록증 수정 시 false로 리셋 */
    @Column(nullable = false)
    private boolean saleAllowed = false;

    /** 가입용 */
    public BrandUser(String id,
                     String hashedPwd,
                     String emailAddress,
                     String phoneE164,
                     String firmName,
                     String firmAddress,
                     String businessRegistration,
                     String firmWebUrl,
                     String firmEmail,
                     String firmPhone) {
        super(id, hashedPwd, emailAddress, phoneE164, Grade.BRAND, Provider.BRAND);
        this.firmName = firmName;
        this.firmAddress = firmAddress;
        this.businessRegistration = businessRegistration;
        this.firmWebUrl = firmWebUrl;
        this.firmEmail = firmEmail;
        this.firmPhone = firmPhone;
    }

    /** ✅ 더티체킹 기반 부분 업데이트(세터/Optional 없이, 서비스에서 미리 병합한 유효값만 받음) */
    public void updateBrandUser(String id,
                                String password,
                                String emailAddress,
                                String phoneNumber,
                                String firmName,
                                String firmAddress,
                                String businessRegistration,
                                String firmWebUrl,
                                String firmEmail,
                                String firmPhone) {
        // 부모 필드(보호수준: protected) — 직접 대입
        this.id           = id;
        this.password     = password;
        this.emailAddress = emailAddress;
        this.phoneNumber  = phoneNumber;

        // 브랜드 고유 필드
        this.firmName    = firmName;
        this.firmAddress = firmAddress;
        this.businessRegistration = businessRegistration;
        this.firmWebUrl  = firmWebUrl;
        this.firmEmail   = firmEmail;
        this.firmPhone   = firmPhone;
        // JPA 더티체킹: 트랜잭션 커밋 시 자동 flush
    }

    public void updateBusinessCert(String filename) {
        this.businessRegistrationCertificateImageUrl = filename;
        this.saleAllowed = false;
    }

    public void updateSaleAllowed(boolean allowed) {
        this.saleAllowed = allowed;
    }
}
