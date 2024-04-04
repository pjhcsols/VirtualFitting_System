package basilium.basiliumserver.configuration;

import basilium.basiliumserver.service.user.NormalUserService;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final NormalUserService normalUserService;
    //private final BrandUserService brandUserService;
    //private final SuperUserService superUserService;

    @Value("${jwt.secret}")
    private String secretKey;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .httpBasic(HttpBasicConfigurer::disable)
                .csrf(CsrfConfigurer:: disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(authorize ->
                        authorize
                                .requestMatchers("/normalUser/signup", "/normalUser/login").permitAll()
                                .requestMatchers("/brandUser/signup", "/brandUser/login").permitAll()
                                .requestMatchers("/superUser/signup", "/superUser/login").permitAll()
                                //.antMatchers("/normalUser/signup", "/normalUser/login").permitAll()
                                //.antMatchers("/v1/brandUser/signup", "/v1/brandUser/login").permitAll()
                                //.antMatchers("/v1/superUser/signup", "/v1/superUser/login").permitAll()
                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                .requestMatchers(HttpMethod.POST, "/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/**").permitAll()
                )


                .sessionManagement(configurer -> configurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(new JwtFilter(normalUserService, secretKey), UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
