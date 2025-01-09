package basilium.basiliumserver.global.error.exception;

public record ExceptionResponse(
        int exceptionCode,
        String message
) {

}
