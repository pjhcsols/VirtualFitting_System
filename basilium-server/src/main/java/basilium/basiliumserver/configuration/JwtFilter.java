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

    //로그아웃 토큰 검증 로직
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
        log.info("[토큰 검증]");
        log.info("authorization:{}", authorization);

        if(authorization == null || !authorization.startsWith("Bearer ")){
            //log.error("authorization을 잘못보냈습니다.");
            filterChain.doFilter(request, response);
            return;
        }

        //Token 꺼내기
        String token = authorization.split(" ")[1];

        // Token 검증
        if (!JwtUtil.isTokenValid(token, secretKey)) {
            log.error("유효하지 않은 토큰입니다.");
            filterChain.doFilter(request, response);
            return;
        }

        // 블랙리스트에 있는 토큰인지 확인
        if (JwtUtil.isTokenBlacklisted(token)) {
            log.error("블랙리스트에 등록된 토큰입니다.");
            filterChain.doFilter(request, response);
            return;
        }

        // Token Expiration 체크
        if (JwtUtil.isExpired(token, secretKey)) {
            log.error("토큰이 만료되었습니다.");
            filterChain.doFilter(request, response);
            return;
        }
        //log.info(token);


        //**** 로그아웃 성공시 로직 ****
        String userName = JwtUtil.getUserName(token, secretKey);
        String userType = JwtUtil.getUserType(token, secretKey);
        log.info("------------------------------------------------------------");
        log.info("userName:[{}]님 로그아웃 시도", userName);
        log.info("userType:{}", userType);

        //권환 부여
        if (userType.equals("normal")) {
            //log.info("일반사용자 토큰 발급");
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(userName, null, List.of(new SimpleGrantedAuthority("ROLE_NORMAL_USER")));
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            filterChain.doFilter(request, response);
            log.info("[normalUser 로그아웃 성공]");
            log.info("------------------------------------------------------------");
        }
        else if(userType.equals("brand")){
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(userName, null, List.of(new SimpleGrantedAuthority("ROLE_BRAND_USER")));
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            filterChain.doFilter(request, response);
            log.info("[brandUser 로그아웃 성공]");
            log.info("------------------------------------------------------------");
        }
        else{
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(userName, null, List.of(new SimpleGrantedAuthority("ROLE_SUPER_USER")));
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            filterChain.doFilter(request, response);
            log.info("[superUser 로그아웃 성공]");
            log.info("------------------------------------------------------------");
        }

    }
}
