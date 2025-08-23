package basilium.basiliumserver.global.apiResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // 200 OK
    SUCCESS(200, "OK", "요청에 성공하였습니다."), //반환값이 있는 경우
    NO_CONTENT(204, "NO_CONTENT", "성공적으로 처리되었으나 반환할 콘텐츠가 없습니다."),

    // 400 Bad Request
    INVALID_INPUT_VALUE(400, "BAD_REQUEST", "입력값이 올바르지 않습니다."),
    BAD_REQUEST(400, "BAD_REQUEST", "잘못된 요청입니다."),
    METHOD_NOT_ALLOWED(405, "METHOD_NOT_ALLOWED", "허용되지 않은 HTTP 메서드입니다."),
    UNSUPPORTED_MEDIA_TYPE(415, "UNSUPPORTED_MEDIA_TYPE", "지원되지 않는 미디어 타입입니다."),

    // 401 Unauthorized
    UNAUTHENTICATED(401, "UNAUTHORIZED", "인증이 필요합니다."),

    // 403 Forbidden
    ACCESS_DENIED(403, "FORBIDDEN", "접근이 거부되었습니다."),

    // 404 Not Found
    RESOURCE_NOT_FOUND(404, "NOT_FOUND", "리소스를 찾을 수 없습니다."),
    MEMBER_NOT_FOUND(404, "NOT_FOUND", "유저를 찾을 수 없습니다."),

    // 409 Conflict
    DUPLICATE_RESOURCE(409, "CONFLICT", "데이터가 이미 존재합니다."),
    CONFLICT(409, "CONFLICT", "데이터가 이미 존재합니다."),

    // 500 Internal Server Error
    SERVER_ERROR(500, "INTERNAL_SERVER_ERROR", "서버 내부 오류가 발생했습니다.");

    private final int status;
    private final String code;
    private final String message;
}
