package basilium.basiliumserver.configuration;

import basilium.basiliumserver.service.user.NormalUserService;
import basilium.basiliumserver.util.JwtUtil;


import java.io.IOException;
import java.util.List;
//jwt
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;






@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final NormalUserService normalUserService;
    //private final BrandUserService brandUserService;
    //private final SuperUserService superUserService;

    @Value("${jwt.secret}")
    private final String secretKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
        log.info("authorization:{}", authorization);

        if(authorization == null || !authorization.startsWith("Bearer ")){
            log.error("authorization을 잘못보냈습니다.");
            filterChain.doFilter(request, response);
            return;
        }

        //Token 꺼내기
        String token = authorization.split(" ")[1];
        log.info(token);

        //Token Expiration 체크
        if (JwtUtil.isExpired(token, secretKey)){
            log.error("토큰이 만료되었습니다.");
            filterChain.doFilter(request, response);
            return;
        }
        log.info(token);

        //UserName Token에서 꺼내기
        String userName = JwtUtil.getUserName(token, secretKey);
        String userType = JwtUtil.getUserType(token, secretKey);
        log.info("userName:{}", userName);
        log.info("userType:{}", userType);
        //권환 부여
        if (userType.equals("normal")) {
            log.info("WTF");
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(userName, null, List.of(new SimpleGrantedAuthority("ROLE_NORMAL_USER")));
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            filterChain.doFilter(request, response);
        }
        else if(userType.equals("brand")){
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(userName, null, List.of(new SimpleGrantedAuthority("ROLE_BRAND_USER")));
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            filterChain.doFilter(request, response);
        }
        else{
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(userName, null, List.of(new SimpleGrantedAuthority("ROLE_SUPER_USER")));
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            filterChain.doFilter(request, response);
        }
    }
}
