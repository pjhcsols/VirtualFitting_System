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
    UNSUPPORTED_MEDIA_TYPE(415, "UNSUPPORTED_MEDIA_TYPE", "지원되지 않는 미디어 타입입니다."),

    // 400 Bad Request (Auth 관련: 기존 AuthExceptionType 반영)
    INVALID_TOKEN(400, "INVALID_TOKEN", "토큰이 유효하지 않습니다"),
    SIGNATURE_NOT_FOUND(400, "SIGNATURE_NOT_FOUND", "서명을 확인하지 못했습니다"),
    MALFORMED_TOKEN(400, "MALFORMED_TOKEN", "토큰 형식이 잘못되었습니다"),
    EXPIRED_TOKEN(400, "EXPIRED_TOKEN", "이미 만료된 토큰입니다"),
    UNSUPPORTED_TOKEN(400, "UNSUPPORTED_TOKEN", "지원하지 않는 토큰입니다"),
    INVALID_SIGNATURE(400, "INVALID_SIGNATURE", "잘못된 서명입니다"),
    UNSUPPORTED_LOGIN_PROVIDER(400, "UNSUPPORTED_LOGIN_PROVIDER", "지원하지 않는 로그인 방식입니다"),

    // 401 Unauthorized
    UNAUTHENTICATED(401, "UNAUTHORIZED", "인증이 필요합니다."),
    INVALID_PASSWORD(401, "INVALID_PASSWORD", "비밀번호가 일치하지 않습니다"),

    // 403 Forbidden
    ACCESS_DENIED(403, "FORBIDDEN", "접근이 거부되었습니다."),

    // 404 Not Found
    RESOURCE_NOT_FOUND(404, "NOT_FOUND", "리소스를 찾을 수 없습니다."),
    MEMBER_NOT_FOUND(404, "NOT_FOUND", "유저를 찾을 수 없습니다."),

    // 405 Method Not Allowed
    METHOD_NOT_ALLOWED(405, "METHOD_NOT_ALLOWED", "허용되지 않은 HTTP 메서드입니다."),

    // 409 Conflict
    DUPLICATE_RESOURCE(409, "CONFLICT", "데이터가 이미 존재합니다."),
    CONFLICT(409, "CONFLICT", "데이터가 이미 존재합니다."),

    // 500 Internal Server Error
    SERVER_ERROR(500, "INTERNAL_SERVER_ERROR", "서버 내부 오류가 발생했습니다.");

    private final int status;
    private final String code;
    private final String message;
}
