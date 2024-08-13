package basilium.basiliumserver.error.exception;

public record ExceptionResponse(
        int exceptionCode,
        String message
) {

}
