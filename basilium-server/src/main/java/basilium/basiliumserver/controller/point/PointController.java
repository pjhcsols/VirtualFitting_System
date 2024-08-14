package basilium.basiliumserver.controller.point;

import basilium.basiliumserver.auth.support.AuthUser;
import basilium.basiliumserver.domain.user.NormalUser;
import basilium.basiliumserver.repository.user.JpaUserRepo;
import basilium.basiliumserver.service.point.PointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/points")
public class PointController {
/*
    private final PointService pointService;

    @Autowired
    public PointController(PointService pointService) {
        this.pointService = pointService;
    }

 */
    private final PointService pointService;
    private final JpaUserRepo userRepo;

    @Autowired
    public PointController(PointService pointService, JpaUserRepo userRepo) {
        this.pointService = pointService;
        this.userRepo = userRepo;
    }

    @GetMapping
    public ResponseEntity<?> getUserPoints(@AuthUser String userId) {
        //여기서
        Optional<NormalUser> userOptional = userRepo.findByUserNumber(Long.parseLong(userId));
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
        }

        NormalUser user = userOptional.get();
        //이까지 추가로직 나중에 authUser 없애고 리팩토링
        return ResponseEntity.ok(pointService.getUserPoints(user));
    }

    @PostMapping
    public ResponseEntity<?> chargePoints(
            @AuthUser String userId,
            @RequestParam("amount") Long amount) {
        if (amount < 10000) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("최소 충전 금액은 10,000원입니다.");
        }
        //여기서
        Optional<NormalUser> userOptional = userRepo.findByUserNumber(Long.parseLong(userId));
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
        }

        NormalUser user = userOptional.get();
        //이까지 추가로직 나중에 authUser 없애고 리팩토링
        pointService.addPoints(user, amount);

        return ResponseEntity.ok("포인트 충전 완료");
    }
}

