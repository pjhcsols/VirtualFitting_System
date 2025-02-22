package basilium.basiliumserver.global.apiResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
@RequiredArgsConstructor
public class ApiResponse<T> {

    private final int code;
    private final String message;
    private T data;

    public static<T> ApiResponse<T> success(SuccessCode successCode, T data) {
        return new ApiResponse<T>(successCode.getCode(), successCode.getMessage(),data);
    }

    public static ApiResponse<Void> success(SuccessCode successCode) {
        return new ApiResponse<>(successCode.getCode(), successCode.getMessage(),null);
    }

    public static ApiResponse<Void> error(HttpStatus errorCode, String message) {
        return new ApiResponse<>(errorCode.value(), message,null);
    }
}
