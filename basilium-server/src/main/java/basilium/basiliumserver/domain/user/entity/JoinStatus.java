package basilium.basiliumserver.domain.user.entity;

import org.springframework.http.HttpStatus;

//회원가입,로그인
public enum JoinStatus {
    SUCCESS(1, "회원가입 성공", HttpStatus.CREATED),
    DUPLICATE(2, "이미 존재하는 아이디 입니다.", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD_LENGTH(3, "비밀번호는 8 ~ 16자 사이여야 합니다.", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD_STRENGTH(4, "비밀번호는 영문 소문자, 대문자, 특수문자를 포함해야됩니다.", HttpStatus.BAD_REQUEST);


    private final int code;
    private final String message;
    private final HttpStatus status;

    JoinStatus(int code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
