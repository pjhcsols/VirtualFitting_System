package basilium.basiliumserver.global.configuration;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Configuration
@Slf4j
public class StaticBlockConfig {
// /b1 + 스웨거 제외 전부 거르기 변경
    @Bean
    public FilterRegistrationBean<OncePerRequestFilter> staticBlockFilter() {
        FilterRegistrationBean<OncePerRequestFilter> bean = new FilterRegistrationBean<>();
        bean.setFilter(new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest req,
                                            HttpServletResponse res,
                                            FilterChain chain)
                    throws ServletException, IOException {
                String path = req.getRequestURI();

                // 1) 스웨거 UI 리소스는 차단 대상에서 제외
                if (path.startsWith("/swagger-ui")
                        || path.startsWith("/v3/api-docs")
                        || path.startsWith("/webjars/")) {
                    log.debug("[StaticBlockFilter] Allow Swagger resource: {}", path);
                    chain.doFilter(req, res);
                    return;
                }

                log.debug("[StaticBlockFilter] Incoming request: method={}, uri={}",
                        req.getMethod(), req.getRequestURI());

                // 2) "." 요청 차단
                if ("/".equals(path)) {
                    log.debug("[StaticBlockFilter] Block invalid dot-path request: {}", path);
                    res.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid path");
                    return;
                }

                // 3) /sitemap.xml 요청 차단
                if ("/sitemap.xml".equals(path)) {
                    log.debug("[StaticBlockFilter] Block sitemap.xml request");
                    res.sendError(HttpServletResponse.SC_FORBIDDEN, "No sitemap");
                    return;
                }

                // 4) /robots.txt 요청 차단
                if ("/robots.txt".equals(path)) {
                    log.debug("[StaticBlockFilter] Block robots.txt request");
                    res.sendError(HttpServletResponse.SC_FORBIDDEN, "No robots");
                    return;
                }

                if (path.endsWith(".css")) {
                    log.debug("[StaticBlockFilter] Block CSS resource request: {}", path);
                    res.sendError(HttpServletResponse.SC_FORBIDDEN);
                    return;
                }
                if (path.endsWith(".js")) {
                    log.debug("[StaticBlockFilter] Block JS resource request: {}", path);
                    res.sendError(HttpServletResponse.SC_FORBIDDEN);
                    return;
                }
                if (path.endsWith(".ico")) {
                    log.debug("[StaticBlockFilter] Block ICO resource request: {}", path);
                    res.sendError(HttpServletResponse.SC_FORBIDDEN);
                    return;
                }

                // apple-touch-icon 요청 차단
                if ("/apple-touch-icon.png".equals(path)
                        || "/apple-touch-icon-precomposed.png".equals(path)) {
                    log.debug("Block Apple touch icon request: {}", path);
                    res.sendError(HttpServletResponse.SC_FORBIDDEN);
                    return;
                }

                // actuator health 엔드포인트 차단 (모든 메서드)
                if ("/actuator/health".equals(path)) {
                    log.debug("[StaticBlockFilter] Block actuator health request: {}", path);
                    res.sendError(HttpServletResponse.SC_FORBIDDEN, "Health endpoint disabled");
                    return;
                }

                // BOA admin 로그인 페이지 차단 (모든 메서드)
                if ("/boaform/admin/formLogin".equals(path)) {
                    log.debug("[StaticBlockFilter] Block BOA formLogin request: {}", path);
                    res.sendError(HttpServletResponse.SC_FORBIDDEN, "Not allowed BoaForm admin");
                    return;
                }

                // /manager/text/list 요청 차단 (모든 메서드)
                if ("/manager/text/list".equals(path)) {
                    log.debug("[StaticBlockFilter] Block manager text list request: {}", path);
                    res.sendError(HttpServletResponse.SC_FORBIDDEN, "Not allowed");
                    return;
                }

                // /manager/html 요청 차단 (모든 메서드)
                if ("/manager/html".equals(path)) {
                    log.debug("[StaticBlockFilter] Block manager html request: {}", path);
                    res.sendError(HttpServletResponse.SC_FORBIDDEN, "Not allowed");
                    return;
                }
                // 그 외 정상 요청
                chain.doFilter(req, res);
            }
        });
        //bean.addUrlPatterns("*.css", "*.js", "*.ico", "*.png", " .", "*.xml", "*.txt");
        bean.addUrlPatterns("/*");
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }
}
