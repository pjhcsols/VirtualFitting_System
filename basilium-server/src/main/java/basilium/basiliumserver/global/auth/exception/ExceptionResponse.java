package basilium.basiliumserver.global.auth.exception;

public record ExceptionResponse(
        int exceptionCode,
        String message
) {

}
