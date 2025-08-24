// src/main/java/basilium/basiliumserver/global/configuration/swagger/SwaggerConfig.java
package basilium.basiliumserver.global.configuration.swagger;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/*
 * Swagger/OpenAPI 메인 구성
 * - JWT 스키마만 전역 등록(전역 보안 요구 미적용)
 * - 자물쇠는 OperationCustomizer를 그룹에 명시적으로 연결해 조건부 부착
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        final SecurityScheme bearer = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT");

        final Components components = new Components()
                .addSecuritySchemes("bearer-key", bearer);

        return new OpenAPI()
                .info(new Info()
                        .title("프로젝트 API")
                        .description("상품을 등록하고, 상품과 User image 통한 가상 착용 서비스를 제공합니다.")
                        .version("1.0.0"))
                .components(components);
        // 전역 SecurityRequirement 미적용 → 기본은 자물쇠 없음
    }

    /* 전체 그룹(기본) + OperationCustomizer 연결 */
    @Bean
    public GroupedOpenApi allApi(OperationCustomizer exposePreAuthorizeAndHardenSecurityDocs) {
        return GroupedOpenApi.builder()
                .group("all")
                .packagesToScan("basilium.basiliumserver")
                .addOperationCustomizer(exposePreAuthorizeAndHardenSecurityDocs)
                .build();
    }
}
