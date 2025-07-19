// src/main/java/basilium/basiliumserver/global/apiResponse/ApiResponse.java
package basilium.basiliumserver.global.apiResponse;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Optional;

@Getter
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_ABSENT)
public class ApiResponse<T> {
    private final String      timestamp;
    private final int         status;
    private final String      code;
    private final String      message;
    private final Optional<T> data;

    private static String now() {
        return ZonedDateTime.now(ZoneId.of("Asia/Seoul"))
                .toOffsetDateTime()
                .toString();
    }

    /*
    * 기존: 데이터를 포함한 성공 응답
    * ResponseEntity.ok(ApiResponse.success({data}))
    * */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(
                now(),
                ErrorCode.SUCCESS.getStatus(),
                ErrorCode.SUCCESS.getCode(),
                ErrorCode.SUCCESS.getMessage(),
                Optional.ofNullable(data)
        );
    }

    /*
    * 추가: 데이터 없이 성공 응답
    * ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.success());
    * */
    public static ApiResponse<Void> success() {
        return new ApiResponse<>(
                now(),
                ErrorCode.NO_CONTENT.getStatus(),
                ErrorCode.NO_CONTENT.getCode(),
                ErrorCode.NO_CONTENT.getMessage(),
                Optional.empty()
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