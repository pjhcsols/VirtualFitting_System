// src/main/java/basilium/basiliumserver/global/auth/JwtFilter.java
package basilium.basiliumserver.global.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        var tokenOpt = jwtUtil.removeBearer(request.getHeader(HttpHeaders.AUTHORIZATION));
        if (tokenOpt.isEmpty()) {
            chain.doFilter(request, response);
            return;
        }

        String token = tokenOpt.get();
        log.info("[Token 검증] {}", token);

        if (jwtUtil.isTokenBlacklisted(token)) {
            throw new BadCredentialsException("블랙리스트에 등록된 토큰입니다.");
        }

        final Claims claims;
        try {
            claims = jwtUtil.getClaims(token); // 단일 파싱
        } catch (ExpiredJwtException e) {
            throw new CredentialsExpiredException("만료된 토큰입니다.", e);
        } catch (JwtException e) {
            throw new BadCredentialsException("유효하지 않은 엑세스 토큰입니다.", e);
        }

        String userId = claims.getSubject();
        String role   = claims.get("role", String.class);
        if (role == null) {
            throw new InsufficientAuthenticationException("권한 정보가 없습니다.");
        }

        var auths = List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
        var auth  = new UsernamePasswordAuthenticationToken(userId, null, auths);
        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(auth);

        chain.doFilter(request, response);
    }
}
