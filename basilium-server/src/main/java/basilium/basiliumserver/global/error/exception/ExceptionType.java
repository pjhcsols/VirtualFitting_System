package basilium.basiliumserver.global.error.exception;

public interface ExceptionType {

    Status status();

    int exceptionCode();

    String message();

}
