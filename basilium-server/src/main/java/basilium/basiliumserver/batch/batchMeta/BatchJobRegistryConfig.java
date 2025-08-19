package basilium.basiliumserver.batch.batchMeta;

import org.springframework.batch.core.configuration.JobRegistry;
import org.springframework.batch.core.configuration.support.JobRegistrySmartInitializingSingleton;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.BeanDefinitionRegistryPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;

@Configuration(proxyBeanMethods = false)
public class BatchJobRegistryConfig {

    /**
     * 1) Boot 자동설정이 등록하는 BeanPostProcessor 이름("jobRegistryBeanPostProcessor")을 제거
     *    - BPP의 조기생성/의존 꼬임으로 생기는 WARN의 근본 원인 차단
     */
    @Bean
    public static BeanDefinitionRegistryPostProcessor removeBootJobRegistryBpp() {
        return new BeanDefinitionRegistryPostProcessor() {
            @Override
            public void postProcessBeanDefinitionRegistry(@NonNull BeanDefinitionRegistry registry) throws BeansException {
                if (registry.containsBeanDefinition("jobRegistryBeanPostProcessor")) {
                    registry.removeBeanDefinition("jobRegistryBeanPostProcessor");
                }
            }
            @Override
            public void postProcessBeanFactory(@NonNull org.springframework.beans.factory.config.ConfigurableListableBeanFactory beanFactory) throws BeansException {
                // no-op
            }
        };
    }

    /**
     * 2) 대체: SmartInitializingSingleton으로 모든 Job을 컨텍스트 초기화 후 JobRegistry에 등록
     *    - BPP가 아니라 초기화 완료 시점 콜백이라 타이밍 경고가 발생하지 않음
     */
    @Bean
    public JobRegistrySmartInitializingSingleton jobRegistrySmartInitializingSingleton(JobRegistry jobRegistry) {
        return new JobRegistrySmartInitializingSingleton(jobRegistry);
    }
}

