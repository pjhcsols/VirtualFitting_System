package basilium.basiliumserver.global.apiResponse;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.bind.MissingServletRequestParameterException;

import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** 비즈니스 예외 */
    @ExceptionHandler(BasiliumCustomException.class)
    public ResponseEntity<ApiResponse<Void>> handleCustom(BasiliumCustomException ex) {
        ErrorCode code = ex.getErrorCode();
        var elem = ex.getStackTrace()[0];
        var location = String.format("%s.%s:%d",
                elem.getClassName(), elem.getMethodName(), elem.getLineNumber());
        var message = String.format("%s (at %s)", ex.getMessage(), location);

        log.error("Business exception: {}", message);
        return ResponseEntity
                .status(code.getStatus())
                .body(ApiResponse.error(code, message));
    }

    /** 입력 검증 실패 (@Valid) */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
        var details = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> String.format("%s[%s]: %s",
                        fe.getField(), fe.getRejectedValue(), fe.getDefaultMessage()))
                .collect(Collectors.joining(", "));
        var message = "Validation failed: " + details;

        log.error("Validation error: {}", message);
        return ResponseEntity
                .badRequest()
                .body(ApiResponse.error(ErrorCode.INVALID_INPUT_VALUE, message));
    }

    /** 파라미터 타입 불일치 */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        var name = ex.getName();
        var value = ex.getValue();
        var requiredType = ex.getRequiredType() != null
                ? ex.getRequiredType().getSimpleName() : "Unknown";
        var message = String.format("Parameter '%s' expects '%s' but got '%s'",
                name, requiredType, value);

        log.error("Type mismatch: {}", message);
        return ResponseEntity
                .badRequest()
                .body(ApiResponse.error(ErrorCode.INVALID_INPUT_VALUE, message));
    }

    /** 필수 파라미터 누락 */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse<Void>> handleMissingParam(MissingServletRequestParameterException ex) {
        var name = ex.getParameterName();
        var message = "Missing request parameter: " + name;

        log.error("Missing parameter: {}", name);
        return ResponseEntity
                .badRequest()
                .body(ApiResponse.error(ErrorCode.INVALID_INPUT_VALUE, message));
    }

    /** 지원되지 않는 HTTP 메서드 */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodNotAllowed(HttpRequestMethodNotSupportedException ex) {
        log.error("Method not allowed: {}", ex.getMethod());
        return ResponseEntity
                .status(ErrorCode.METHOD_NOT_ALLOWED.getStatus())
                .body(ApiResponse.error(ErrorCode.METHOD_NOT_ALLOWED));
    }

    /** 지원되지 않는 미디어 타입 */
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnsupportedMediaType(HttpMediaTypeNotSupportedException ex) {
        log.error("Unsupported media type: {}", ex.getContentType());
        return ResponseEntity
                .status(ErrorCode.UNSUPPORTED_MEDIA_TYPE.getStatus())
                .body(ApiResponse.error(ErrorCode.UNSUPPORTED_MEDIA_TYPE));
    }

    /** 인증 필요 */
    @ExceptionHandler({ org.springframework.security.core.AuthenticationException.class })
    public ResponseEntity<ApiResponse<Void>> handleAuthentication(Exception ex) {
        log.error("Authentication required: {}", ex.getMessage());
        return ResponseEntity
                .status(ErrorCode.UNAUTHENTICATED.getStatus())
                .body(ApiResponse.error(ErrorCode.UNAUTHENTICATED));
    }

    /** 접근 권한 없음 */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
        log.error("Access denied: {}", ex.getMessage());
        return ResponseEntity
                .status(ErrorCode.ACCESS_DENIED.getStatus())
                .body(ApiResponse.error(ErrorCode.ACCESS_DENIED));
    }

    /** 그 외 모든 예외 */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleOthers(Exception ex) {
        log.error("Unhandled exception", ex);
        return ResponseEntity
                .status(ErrorCode.SERVER_ERROR.getStatus())
                .body(ApiResponse.error(ErrorCode.SERVER_ERROR));
    }
}

