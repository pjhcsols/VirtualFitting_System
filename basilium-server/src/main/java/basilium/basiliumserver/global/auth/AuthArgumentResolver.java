package basilium.basiliumserver.global.auth;


import basilium.basiliumserver.global.auth.exception.AuthException;
import basilium.basiliumserver.global.auth.exception.AuthExceptionType;
import basilium.basiliumserver.global.auth.support.AuthUser;
import basilium.basiliumserver.global.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;


@Slf4j
@RequiredArgsConstructor
@Component
public class AuthArgumentResolver implements HandlerMethodArgumentResolver {

    private final JwtUtil jwtUtil;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(AuthUser.class) &&
                parameter.getParameterType().equals(String.class);
    }

    @Override
    public Object resolveArgument(
            MethodParameter parameter,
            ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest,
            WebDataBinderFactory binderFactory
    ) {
        log.info("AuthArgumentResolver 동작");
        HttpServletRequest httpServletRequest = webRequest.getNativeRequest(HttpServletRequest.class);
        if (httpServletRequest != null) {
            String token = httpServletRequest.getHeader("Authorization");
            token = jwtUtil.removeBearer(token);
            if (token != null && !token.trim().isEmpty()) {
                if (jwtUtil.validateToken(token)) {
                    log.info("jwtUtil.getUserInfoFromToken(token).getId() : {}",
                            jwtUtil.getUserId(token));
                    return jwtUtil.getUserId(token);
                }
            }
            AuthUser annotation = parameter.getParameterAnnotation(AuthUser.class);
            if (annotation != null && !annotation.required()) {
                return null;
            }
        }
        throw new AuthException(AuthExceptionType.UNAUTHORIZED);
    }
}
