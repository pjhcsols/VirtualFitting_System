package basilium.basiliumserver.global.apiResponse;

import lombok.Getter;

@Getter
public class BasiliumCustomException extends RuntimeException {
    private final ErrorCode errorCode;

    public BasiliumCustomException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public BasiliumCustomException(ErrorCode errorCode, String detailMessage) {
        super(detailMessage);
        this.errorCode = errorCode;
    }
}

