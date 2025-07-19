package basilium.basiliumserver.global.configuration;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Configuration
public class StaticBlockConfig {

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
                if (path.endsWith(".css") ||
                        path.endsWith(".js")  ||
                        path.endsWith(".ico")) {
                    res.sendError(HttpServletResponse.SC_FORBIDDEN);
                    return;
                }
                chain.doFilter(req, res);
            }
        });
        bean.addUrlPatterns("*.css", "*.js", "*.ico");
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }
}

