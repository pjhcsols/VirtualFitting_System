package basilium.basiliumserver.common.exception;

public interface ExceptionType {

    Status status();

    int exceptionCode();

    String message();

}
