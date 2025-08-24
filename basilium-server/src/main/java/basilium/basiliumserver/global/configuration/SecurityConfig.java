package basilium.basiliumserver.global.configuration;

import basilium.basiliumserver.global.apiResponse.JsonAccessDeniedHandler;
import basilium.basiliumserver.global.apiResponse.JsonAuthenticationEntryPoint;
import basilium.basiliumserver.global.auth.JwtFilter;
import basilium.basiliumserver.global.auth.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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

@EnableMethodSecurity(prePostEnabled = true)
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final JsonAuthenticationEntryPoint entryPoint;
    private final JsonAccessDeniedHandler deniedHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .httpBasic(HttpBasicConfigurer::disable)
                .csrf(CsrfConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(eh -> eh
                        .authenticationEntryPoint(entryPoint)     // 401 JSON
                        .accessDeniedHandler(deniedHandler)       // 403 JSON
                )
                .authorizeHttpRequests(auth -> auth
                        // CORS preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 공개 엔드포인트: 헬스체크/스웨거
                        .requestMatchers("/health").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // 공개 API 루트: /b1/** 만 컨트롤러까지 진입 허용
                        .requestMatchers("/b1/**").permitAll()

                        // (선택) URL 레벨에서 바로 인증이 필요한 엔드포인트가 있다면 여기서 지정
                        //.requestMatchers("/health", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        //.requestMatchers("/users/logout", "/profile/mypage").authenticated()
                        //.anyRequest().permitAll() // 나머지 모두 통과

                        // 그 외 전부 차단(403)
                        .anyRequest().denyAll()
                )
                .addFilterBefore(new JwtFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}