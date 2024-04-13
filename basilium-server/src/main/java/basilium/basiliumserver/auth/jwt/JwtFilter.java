package basilium.basiliumserver.auth.jwt;

import basilium.basiliumserver.auth.service.AuthService;
import basilium.basiliumserver.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

//회원가입,로그인
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException, ServletException {
        final String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Token 꺼내기
        String token = authorization.split(" ")[1];
        log.info(token);

        // Token 검증
        if (!jwtUtil.validateToken(token)) {
            log.error("유효하지 않은 토큰입니다.");
            filterChain.doFilter(request, response);
            return;
        }

        // 블랙리스트에 있는 토큰인지 확인
        if (jwtUtil.isTokenBlacklisted(token)) {
            log.error("블랙리스트에 등록된 토큰입니다.");
            filterChain.doFilter(request, response);
            return;
        }

        // Token Expiration 체크
        if (jwtUtil.isTokenExpired(token)) {
            log.error("토큰이 만료되었습니다.");
            filterChain.doFilter(request, response);
            return;
        }
        log.info(token);

        // UserName Token에서 꺼내기
        String userName = jwtUtil.getUserEmail(token);
        //String userType = JwtUtil.getUserType(token, secretKey);
        log.info("userName:{}", userName);
        //log.info("userType:{}", userType);

        // "host" 유저에만 권한 부여

        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(userName, null, List.of(new SimpleGrantedAuthority("USER")));
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        filterChain.doFilter(request, response);
    }


}
