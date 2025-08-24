package basilium.basiliumserver.global.apiResponse;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.*;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JsonAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper om;

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       org.springframework.security.access.AccessDeniedException ex) throws IOException {
        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType("application/json;charset=UTF-8");
        String msg = (ex.getMessage() == null || ex.getMessage().isBlank())
                ? ErrorCode.ACCESS_DENIED.getMessage()
                : ex.getMessage();
        var body = ApiResponse.error(ErrorCode.ACCESS_DENIED, msg);
        om.writeValue(response.getOutputStream(), body);
    }
}
