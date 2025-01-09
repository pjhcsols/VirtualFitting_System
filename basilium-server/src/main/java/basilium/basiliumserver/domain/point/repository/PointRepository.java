package basilium.basiliumserver.domain.point.repository;

import basilium.basiliumserver.domain.point.entity.Point;
import basilium.basiliumserver.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PointRepository extends JpaRepository<Point, Long> {
    Optional<Point> findByUser(User user);
}
