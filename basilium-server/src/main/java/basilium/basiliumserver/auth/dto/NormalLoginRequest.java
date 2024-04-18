package basilium.basiliumserver.auth.dto;

//회원가입,로그인
public record NormalLoginRequest(
        String userEmail,
        String userPassword
) {

}