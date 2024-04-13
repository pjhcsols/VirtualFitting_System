package basilium.basiliumserver.common.exception;

public record ExceptionResponse(
        int exceptionCode,
        String message
) {

}
