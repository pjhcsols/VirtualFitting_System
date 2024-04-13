package basilium.basiliumserver.auth.exception;


import basilium.basiliumserver.common.exception.BaseException;

public class AuthException extends BaseException {

    public AuthException(AuthExceptionType exceptionType) {
        super(exceptionType);
    }
}
