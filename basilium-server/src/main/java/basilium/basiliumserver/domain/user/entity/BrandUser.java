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

    public BrandUser(String id,
                     String pwd,
                     String email,
                     String phone,
                     String firmName,
                     String firmAddress,
                     String businessRegistration) {
        super(id, pwd, email, phone, Grade.BRAND, Provider.BRAND);
        this.firmName = firmName;
        this.firmAddress = firmAddress;
        this.businessRegistration = businessRegistration;
    }

    /**
     * 프로필 정보 일괄 업데이트 (Dirty Checking)
     */
    public void updateProfile(String firmName,
                              String firmAddress,
                              String businessRegistration,
                              String firmWebUrl,
                              String firmEmail,
                              String firmPhone) {
        this.firmName = firmName;
        this.firmAddress = firmAddress;
        this.businessRegistration = businessRegistration;
        this.firmWebUrl = firmWebUrl;
        this.firmEmail = firmEmail;
        this.firmPhone = firmPhone;
    }

    public void updateBusinessCert(String filename) {
        this.businessRegistrationCertificateImageUrl = filename;
        this.saleAllowed = false;
    }

    public void updateSaleAllowed(boolean allowed) {
        this.saleAllowed = allowed;
    }
}
