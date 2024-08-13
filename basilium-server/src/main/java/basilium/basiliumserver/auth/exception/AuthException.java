package basilium.basiliumserver.auth.exception;


import basilium.basiliumserver.error.exception.BaseException;

public class AuthException extends BaseException {

    public AuthException(AuthExceptionType exceptionType) {
        super(exceptionType);
    }
}
