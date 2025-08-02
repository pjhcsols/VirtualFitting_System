package basilium.basiliumserver.global.configuration;

import basilium.basiliumserver.global.auth.JwtFilter;
import basilium.basiliumserver.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/*
@EnableMethodSecurity
* @PreAuthorize("hasRole('BRAND') and #userId == authentication.principal") 는 다음 두 가지 조건을 동시에 검사합니다:
* hasRole('BRAND')
* 현재 인증된 사용자가 ROLE_BRAND 권한을 가지고 있는지 확인합니다.
* #userId == authentication.principal
* 메서드 파라미터로 넘어온 userId 와 Spring Security 컨텍스트에 저장된 principal(로그인된 사용자 ID) 이 같은지 비교합니다.
* #userId : SpEL에서 메서드의 userId 파라미터를 가리킵니다.
* authentication.principal : UsernamePasswordAuthenticationToken 에 설정된 principal 값(이 경우 JWT로부터 추출된 사용자 ID) 입니다.
*/

// 경로는 인증된 사용자만 접근할 수 있도록 설정되었습니다. 즉, 사용자는 해당 경로에 접근하기 위해 유효한 JWT 토큰을 제공해야 합니다.
//@EnableMethodSecurity
@EnableMethodSecurity(prePostEnabled = true)
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .httpBasic(HttpBasicConfigurer::disable)
                .csrf(CsrfConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(authorize ->
                        authorize
                                .requestMatchers("/users/logout", "/profile/mypage")
                                .authenticated()
                                .anyRequest()
                                .permitAll()

                )

                //.antMatchers(HttpMethod.POST, "/v1/brandUser/**").hasRole("BRAND_USER")
                //.antMatchers(HttpMethod.POST, "/v1/superUser/**").hasRole("SUPER_USER")
                .sessionManagement(configurer -> configurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(new JwtFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}

