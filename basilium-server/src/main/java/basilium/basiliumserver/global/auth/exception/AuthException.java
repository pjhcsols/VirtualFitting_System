package basilium.basiliumserver.global.auth.exception;


public class AuthException extends BaseException {

    public AuthException(AuthExceptionType exceptionType) {
        super(exceptionType);
    }
}
