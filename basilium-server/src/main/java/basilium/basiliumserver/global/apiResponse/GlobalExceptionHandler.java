package basilium.basiliumserver.global.apiResponse;

import jakarta.persistence.OptimisticLockException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindException;
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
    /*
    @ExceptionHandler(BasiliumCustomException.class)
    public ResponseEntity<ApiResponse<Void>> handleCustom(BasiliumCustomException ex) {
        ErrorCode code = ex.getErrorCode();
        log.error("Business exception: {}", ex.getMessage(), ex);
        return ResponseEntity.status(code.getStatus()).body(ApiResponse.error(code, ex.getMessage()));
    }
     */

    /* 400 계열 */
    /** 입력 검증 실패 (@Valid) */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
        var details = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> String.format("%s[%s]: %s", fe.getField(), fe.getRejectedValue(), fe.getDefaultMessage()))
                .collect(Collectors.joining(", "));
        var message = "Validation failed: " + details;
        log.error("Validation error: {}", message);
        return ResponseEntity.badRequest().body(ApiResponse.error(ErrorCode.INVALID_INPUT_VALUE, message));
    }

    /** (@Validated) 제약 위반 */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleConstraint(ConstraintViolationException ex) {
        var message = ex.getConstraintViolations().stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .collect(Collectors.joining(", "));
        log.error("Constraint violation: {}", message);
        return ResponseEntity.badRequest().body(ApiResponse.error(ErrorCode.INVALID_INPUT_VALUE, message));
    }

    /** 폼/쿼리 바인딩 오류 */
    @ExceptionHandler(BindException.class)
    public ResponseEntity<ApiResponse<Void>> handleBind(BindException ex) {
        var details = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> String.format("%s[%s]: %s", fe.getField(), fe.getRejectedValue(), fe.getDefaultMessage()))
                .collect(Collectors.joining(", "));
        var message = "Binding failed: " + details;
        log.error("Bind error: {}", message);
        return ResponseEntity.badRequest().body(ApiResponse.error(ErrorCode.INVALID_INPUT_VALUE, message));
    }

    /** 파라미터 타입 불일치 */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        var required = ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "Unknown";
        var message  = String.format("Parameter '%s' expects '%s' but got '%s'",
                ex.getName(), required, ex.getValue());
        log.error("Type mismatch: {}", message);
        return ResponseEntity.badRequest().body(ApiResponse.error(ErrorCode.INVALID_INPUT_VALUE, message));
    }

    /** 스프링 타입 변환 실패 */
    @ExceptionHandler(ConversionFailedException.class)
    public ResponseEntity<ApiResponse<Void>> handleConversionFailed(ConversionFailedException ex) {
        log.error("Conversion failed: {}", ex.getMessage());
        return ResponseEntity.badRequest().body(ApiResponse.error(ErrorCode.INVALID_INPUT_VALUE, "Conversion failed"));
    }

    /** 필수 파라미터 누락 */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse<Void>> handleMissingParam(MissingServletRequestParameterException ex) {
        var message = "Missing request parameter: " + ex.getParameterName();
        log.error("Missing parameter: {}", ex.getParameterName());
        return ResponseEntity.badRequest().body(ApiResponse.error(ErrorCode.INVALID_INPUT_VALUE, message));
    }

    /** JSON 파싱/본문 읽기 실패 */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnreadable(HttpMessageNotReadableException ex) {
        log.error("Message not readable", ex);
        return ResponseEntity.badRequest().body(ApiResponse.error(ErrorCode.BAD_REQUEST, "Malformed JSON request"));
    }

    /** 잘못된 인자(서비스 내부 방어로직) */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(IllegalArgumentException ex) {
        log.error("Illegal argument: {}", ex.getMessage());
        return ResponseEntity
                .status(ErrorCode.INVALID_INPUT_VALUE.getStatus())
                .body(ApiResponse.error(ErrorCode.INVALID_INPUT_VALUE, ex.getMessage()));
    }

    /* 405 / 415 */
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

    /* 401 / 403 */
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

    /* 409 */
    /** 낙관적 락 충돌(재고 경합 등) */
    @ExceptionHandler({ OptimisticLockException.class, ObjectOptimisticLockingFailureException.class })
    public ResponseEntity<ApiResponse<Void>> handleOptimisticLock(Exception ex) {
        log.error("Optimistic lock conflict: {}", ex.getMessage());
        return ResponseEntity
                .status(ErrorCode.CONFLICT.getStatus())
                .body(ApiResponse.error(ErrorCode.CONFLICT, "수정/변경 충돌: 다시 시도해 주세요."));
    }

    /** DB 무결성 위반(중복키/제약조건) */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(DataIntegrityViolationException ex) {
        log.error("Data integrity violation", ex);
        return ResponseEntity
                .status(ErrorCode.CONFLICT.getStatus())
                .body(ApiResponse.error(ErrorCode.CONFLICT, "무결성 제약 위반"));
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

