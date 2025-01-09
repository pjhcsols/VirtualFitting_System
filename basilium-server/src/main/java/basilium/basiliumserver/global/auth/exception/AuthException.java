package basilium.basiliumserver.global.auth.exception;


import basilium.basiliumserver.global.error.exception.BaseException;

public class AuthException extends BaseException {

    public AuthException(AuthExceptionType exceptionType) {
        super(exceptionType);
    }
}
