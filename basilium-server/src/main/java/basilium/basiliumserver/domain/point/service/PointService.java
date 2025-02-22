package basilium.basiliumserver.domain.point.service;

import basilium.basiliumserver.domain.point.entity.Point;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import basilium.basiliumserver.domain.user.entity.User;
import basilium.basiliumserver.domain.point.repository.PointRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PointService {
    private static final Logger logger = LoggerFactory.getLogger(PointService.class);

    private final PointRepository pointRepository;

    public PointService(PointRepository pointRepository) {
        this.pointRepository = pointRepository;
    }

    public Long getUserPoints(User user) {
        return pointRepository.findByUser(user)
                .map(Point::getAmount)
                .orElse(0L);
    }

    @Transactional
    public void usePoints(User user, Long amount) {
        Point point = pointRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("포인트 정보가 없습니다."));

        Long currentAmount = point.getAmount();
        logger.info("현재 포인트: {}, 사용 요청 포인트: {}", currentAmount, amount);

        // 포인트 부족 시 예외 발생
        if (currentAmount < amount) {
            logger.error("포인트가 부족합니다. 현재 포인트: {}, 요청 포인트: {}", currentAmount, amount);
            throw new IllegalArgumentException("포인트가 부족합니다.");
        }

        point.use(amount); //포인트 차감
        pointRepository.save(point);
        logger.info("포인트 사용 완료. 사용자: {}, 사용된 포인트: {}, 남은 포인트: {}", user.getId(), amount, point.getAmount());
    }

    @Transactional
    public void addPoints(NormalUser user, Long amount) {
        Point point = pointRepository.findByUser(user)
                .orElse(new Point(user, 0L));
        point.add(amount);
        pointRepository.save(point);
        logger.info("포인트 적립 완료. 사용자: {}, 적립된 포인트: {}", user.getId(), amount);
    }

}
