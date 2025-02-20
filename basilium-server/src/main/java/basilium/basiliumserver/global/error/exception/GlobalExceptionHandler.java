package basilium.basiliumserver.global.error.exception;


import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class GlobalExceptionHandler {
/*
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ApiResponse<Void>> handleResourceNotFoundException(ResourceNotFoundException e) {
		return ResponseEntity.badRequest().body(ApiResponse.error(HttpStatus.BAD_REQUEST, e.getMessage()));
	}

	@ExceptionHandler(DuplicateResourceException.class)
	public ResponseEntity<ApiResponse<Void>> handleDuplicateRequestException(DuplicateResourceException e) {
		return ResponseEntity.badRequest().body(ApiResponse.error(HttpStatus.BAD_REQUEST, e.getMessage()));
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(IllegalArgumentException e) {
		return ResponseEntity.badRequest().body(ApiResponse.error(HttpStatus.BAD_REQUEST, e.getMessage()));
	}

 */
}
