package basilium.basiliumserver.repository.point;

import basilium.basiliumserver.domain.point.Point;
import basilium.basiliumserver.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PointRepository extends JpaRepository<Point, Long> {
    Optional<Point> findByUser(User user);
}
