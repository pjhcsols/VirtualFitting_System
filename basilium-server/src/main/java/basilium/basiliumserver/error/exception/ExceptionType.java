package basilium.basiliumserver.error.exception;

public interface ExceptionType {

    Status status();

    int exceptionCode();

    String message();

}
