package basilium.basiliumserver.util;

import lombok.Getter;
import org.springframework.http.HttpStatus;


@Getter
public enum LoginStatus {
    SUCCESS(1, "로그인 성공", HttpStatus.CREATED),
    FAIL(2, "아이디 또는 비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatus status;

    LoginStatus(int code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}