package basilium.basiliumserver.global.infra;

/*
import basilium.basiliumserver.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

 */

//infra DB Health check
/*
@Component
@RequiredArgsConstructor
public class CustomDatabaseHealthIndicator implements HealthIndicator {

    private final ProductRepository productRepository;
    @Override
    public Health health() {
        try {
            // 테이블이 존재하는지 확인하는 쿼리 (Users 테이블 사용)
            long count = productRepository.count();
            // 테이블 존재 시 0 이상을 반환
            return Health.up().withDetail("Products table exists, count: ", count).build();
        } catch (Exception e) {
            // 테이블이 없거나 데이터베이스 연결에 문제가 있는 경우
            return Health.down(e).withDetail("Products table", "Table missing or database issue")
                .build();
        }
    }
}


 */