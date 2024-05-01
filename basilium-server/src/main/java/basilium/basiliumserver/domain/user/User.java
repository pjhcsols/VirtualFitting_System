package basilium.basiliumserver.domain.user;


import basilium.basiliumserver.auth.entity.Provider;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;



@Getter
@Setter
@MappedSuperclass
public class User {
    @Id
    @GeneratedValue
    @Column(name="userNumber")
    private Long userNumber;
    private String id;
    private String password;
    private String emailAddress;
    private String phoneNumber;
    private Grade userGrade;
    private Provider loginType;
    String userImageUrl;

    public User() {

    }
/*
    public String getId() {
        return id;
    }



    public void setId(String id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Grade getUserGrade() {
        return userGrade;
    }

    public void setUserGrade(Grade userGrade) {
        this.userGrade = userGrade;
    }

 */
}
