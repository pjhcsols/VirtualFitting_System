package basilium.basiliumserver.global.apiResponse;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.*;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JsonAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper om;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         org.springframework.security.core.AuthenticationException ex) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json;charset=UTF-8");
        String msg = (ex.getMessage() == null || ex.getMessage().isBlank())
                ? ErrorCode.UNAUTHENTICATED.getMessage()
                : ex.getMessage();
        var body = ApiResponse.error(ErrorCode.UNAUTHENTICATED, msg);
        om.writeValue(response.getOutputStream(), body);
    }
}
