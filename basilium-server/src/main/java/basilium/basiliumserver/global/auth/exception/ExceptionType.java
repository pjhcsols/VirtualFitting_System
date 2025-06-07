package basilium.basiliumserver.global.auth.exception;

public interface ExceptionType {

    Status status();

    int exceptionCode();

    String message();

}
