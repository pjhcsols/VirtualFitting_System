package basilium.basiliumserver.global.apiResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum SuccessCode {
    OK(200, "OK"),
    CREATED_SUCCESS(201, "저장에 성공했습니다"),
    NO_CONTENT(204, "삭제에 성공했습니다.");

    private final int code;
    private final String message;

}
