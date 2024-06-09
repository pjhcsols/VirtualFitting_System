package basilium.basiliumserver.controller.product.sse;

import basilium.basiliumserver.domain.product.ProductInfoDTO;
import basilium.basiliumserver.service.product.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

// 구독한 product의 재고가 변경될 때마다 즉시 전송하는 SSE 컨트롤러
@RestController
@RequestMapping("/inventory")
public class SseController {

    public static void updateInventory(Long productId) {

    }

}
