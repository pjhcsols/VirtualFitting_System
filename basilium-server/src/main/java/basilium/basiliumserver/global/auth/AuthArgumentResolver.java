// src/main/java/basilium/basiliumserver/global/auth/AuthArgumentResolver.java
package basilium.basiliumserver.global.auth;

import basilium.basiliumserver.global.apiResponse.BasiliumCustomException;
import basilium.basiliumserver.global.apiResponse.ErrorCode;
import basilium.basiliumserver.global.auth.support.AuthUser;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.*;

import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Component
public class AuthArgumentResolver implements HandlerMethodArgumentResolver {

    private final JwtUtil jwtUtil;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(AuthUser.class)
                && parameter.getParameterType().equals(String.class);
    }

    @Override
    public Object resolveArgument(
            MethodParameter parameter, ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest, WebDataBinderFactory binderFactory
    ) {
        log.info("AuthArgumentResolver 동작");

        final AuthUser anno = parameter.getParameterAnnotation(AuthUser.class);
        final boolean required = (anno == null) || anno.required();

        // 1) Request 꺼내기
        final Optional<HttpServletRequest> requestOpt =
                Optional.ofNullable(webRequest.getNativeRequest(HttpServletRequest.class));

        // 1-2) Authorization → Bearer 제거 → token Optional
        final Optional<String> tokenOpt = requestOpt
                .map(r -> r.getHeader("Authorization"))
                .flatMap(jwtUtil::removeBearer);

        // 2) 토큰 없는 경우
        if (tokenOpt.isEmpty()) {
            if (!required) return null; // 게스트 허용
            throw new BasiliumCustomException(ErrorCode.UNAUTHENTICATED, "로그인한 정보가 없습니다");
        }

        final String token = tokenOpt.get();

        // 3) 블랙리스트 체크
        if (jwtUtil.isTokenBlacklisted(token)) {
            throw new BasiliumCustomException(ErrorCode.INVALID_TOKEN, "블랙리스트에 등록된 토큰입니다");
        }

        // 4) 파싱 1회 + 예외 매핑 (만료/서명오류 구분)
        final String userId;
        final Object role;
        try {
            var claims = jwtUtil.getClaims(token); // 여기서 ExpiredJwtException 등 발생 가능
            userId = claims.getSubject();
            role = claims.get("role");
        } catch (ExpiredJwtException e) {
            throw new BasiliumCustomException(ErrorCode.EXPIRED_TOKEN, "이미 만료된 토큰입니다");
        } catch (JwtException e) { // 서명 불일치, 포맷 오류 등
            throw new BasiliumCustomException(ErrorCode.INVALID_TOKEN, "유효하지 않은 엑세스 토큰입니다");
        }

        // 5) 필수 클레임 검증
        if (role == null) {
            throw new BasiliumCustomException(ErrorCode.INVALID_TOKEN, "권한(role) 정보가 없습니다");
        }

        final String resolvedUserId = Optional.ofNullable(userId)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .orElseThrow(() -> new BasiliumCustomException(
                        ErrorCode.UNAUTHENTICATED, "유효한 사용자 식별자를 찾을 수 없습니다"));

        log.info("jwtUtil.getUserId(token) : {}", resolvedUserId);
        return resolvedUserId;
    }
}