package basilium.basiliumserver.global.apiResponse;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.ZonedDateTime;
import java.time.ZoneId;
import java.util.Optional;

@Getter
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private final String    timestamp;
    private final int       status;
    private final String    code;
    private final String    message;
    private final Optional<T> data;

    private static String now() {
        return ZonedDateTime.now(ZoneId.of("Asia/Seoul"))
                .toOffsetDateTime()
                .toString();
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(
                now(),
                ErrorCode.SUCCESS.getStatus(),
                ErrorCode.SUCCESS.getCode(),
                ErrorCode.SUCCESS.getMessage(),
                Optional.ofNullable(data)
        );
    }

    public static <T> ApiResponse<T> error(ErrorCode errorCode) {
        return new ApiResponse<>(
                now(),
                errorCode.getStatus(),
                errorCode.getCode(),
                errorCode.getMessage(),
                Optional.empty()
        );
    }

    public static <T> ApiResponse<T> error(ErrorCode errorCode, String detailMessage) {
        return new ApiResponse<>(
                now(),
                errorCode.getStatus(),
                errorCode.getCode(),
                detailMessage,
                Optional.empty()
        );
    }
}