// src/main/java/basilium/basiliumserver/global/configuration/swagger/OpenApiPreAuthCustomizer.java
package basilium.basiliumserver.global.configuration.swagger;

import basilium.basiliumserver.global.auth.support.AuthUser;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.method.HandlerMethod;

import java.util.*;

@Slf4j
@Configuration
public class OpenApiPreAuthCustomizer {

    @Bean
    public OperationCustomizer exposePreAuthorizeAndHardenSecurityDocs() {
        return (operation, handlerMethod) -> {
            final Optional<String> spelOpt = extractPreAuthorize(handlerMethod);
            spelOpt.ifPresent(spel -> annotatePreAuthorize(operation, spel));
            addAuthResponses(operation);

            final boolean needsAuth =
                    spelOpt.isPresent() || hasAuthUserParameter(handlerMethod);

            if (needsAuth) {
                operation.addSecurityItem(new SecurityRequirement().addList("bearer-key"));
                log.debug("[OpenAPI] add JWT lock: {}#{}", handlerMethod.getBeanType().getSimpleName(),
                        handlerMethod.getMethod().getName());
            } else {
                log.debug("[OpenAPI] no lock: {}#{}", handlerMethod.getBeanType().getSimpleName(),
                        handlerMethod.getMethod().getName());
            }

            removeAuthUserParameters(operation, handlerMethod);
            return operation;
        };
    }

    private Optional<String> extractPreAuthorize(HandlerMethod handlerMethod) {
        final PreAuthorize onMethod = handlerMethod.getMethodAnnotation(PreAuthorize.class);
        final PreAuthorize onClass = handlerMethod.getBeanType().getAnnotation(PreAuthorize.class);

        return Optional.ofNullable(onMethod)
                .map(PreAuthorize::value)
                .or(() -> Optional.ofNullable(onClass).map(PreAuthorize::value))
                .filter(s -> !s.isBlank());
    }

    private boolean hasAuthUserParameter(HandlerMethod handlerMethod) {
        return Arrays.stream(handlerMethod.getMethodParameters())
                .anyMatch(p -> Arrays.stream(p.getParameterAnnotations()).anyMatch(AuthUser.class::isInstance));
    }

    private void annotatePreAuthorize(Operation operation, String spel) {
        final String base = Optional.ofNullable(operation.getDescription()).orElse("");
        final List<String> parts = new ArrayList<>();
        if (!base.isBlank()) parts.add(base);
        parts.add("Access control (SpEL): " + spel);

        operation.setDescription(String.join("\n\n", parts));
        operation.addExtension("x-preauthorize", spel);
    }

    private void addAuthResponses(Operation operation) {
        final io.swagger.v3.oas.models.responses.ApiResponses responses =
                Optional.ofNullable(operation.getResponses())
                        .orElseGet(io.swagger.v3.oas.models.responses.ApiResponses::new);

        if (!responses.containsKey("401")) {
            responses.addApiResponse("401", new ApiResponse().description("인증 필요(Bearer JWT)"));
        }
        if (!responses.containsKey("403")) {
            responses.addApiResponse("403", new ApiResponse().description("권한 없음(ROLE/소유 불일치)"));
        }
        operation.setResponses(responses);
    }

    private void removeAuthUserParameters(Operation operation, HandlerMethod handlerMethod) {
        final Set<String> authUserParamNames = Arrays.stream(handlerMethod.getMethodParameters())
                .filter(p -> Arrays.stream(p.getParameterAnnotations()).anyMatch(AuthUser.class::isInstance))
                .map(p -> Optional.ofNullable(p.getParameterName()).orElse(""))
                .filter(name -> !name.isBlank())
                .collect(java.util.stream.Collectors.toSet());

        if (authUserParamNames.isEmpty()) return;

        final List<Parameter> params = Optional.ofNullable(operation.getParameters())
                .map(ArrayList::new)
                .orElseGet(ArrayList::new);

        final List<Parameter> filtered = params.stream()
                .filter(p -> !authUserParamNames.contains(Optional.ofNullable(p.getName()).orElse("")))
                .toList();

        operation.setParameters(new ArrayList<>(filtered));
    }
}
