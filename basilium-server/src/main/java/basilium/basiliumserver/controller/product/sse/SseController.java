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

    private static final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();
    private static ProductService productService;

    @Autowired
    public SseController(ProductService productService) {
        SseController.productService = productService;
    }
    /*
    @GetMapping("/subscribe/{productId}")
    public SseEmitter subscribeInventory(@PathVariable Long productId) {
        //SseEmitter emitter = new SseEmitter(10 * 60 * 1000L); // 10분
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); //구독 연결시간 무제한
        emitters.put(productId, emitter);

        // Heartbeat 설정
        ScheduledExecutorService executorService = Executors.newSingleThreadScheduledExecutor();
        executorService.scheduleAtFixedRate(() -> {
            try {
                emitter.send(SseEmitter.event().comment("heartbeat"));
            } catch (IOException e) {
                emitter.completeWithError(e);
            }
        }, 0, 30, TimeUnit.SECONDS); // 30초마다 heartbeat

        emitter.onCompletion(executorService::shutdown);
        emitter.onTimeout(() -> {
            emitters.remove(productId);
            executorService.shutdown();
        });

        return emitter;
    }

     */

    @GetMapping("/subscribe/{productId}")
    public SseEmitter subscribeInventory(@PathVariable Long productId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.put(productId, emitter);

        ScheduledExecutorService executorService = Executors.newSingleThreadScheduledExecutor();
        executorService.scheduleAtFixedRate(() -> {
            try {
                emitter.send(SseEmitter.event().comment("heartbeat"));
            } catch (IOException e) {
                emitter.completeWithError(e);
            }
        }, 0, 30, TimeUnit.SECONDS);

        emitter.onCompletion(() -> {
            emitters.remove(productId);
            executorService.shutdown();
        });
        emitter.onTimeout(() -> {
            emitters.remove(productId);
            executorService.shutdown();
        });

        return emitter;
    }


    // 특정 상품의 재고 구독을 취소하는 메서드
    @PostMapping("/unsubscribe/{productId}")
    public void unsubscribeInventory(@PathVariable Long productId) {
        emitters.remove(productId);
    }

    // 재고가 변경될 때 SSE를 통해 구독자에게 즉시 업데이트하는 메서드
    /*
    public static void updateInventory(Long productId) {
        SseEmitter emitter = emitters.get(productId);
        if (emitter != null) {
            try {
                Long inventory = productService.getProductQuantity(productId);
                emitter.send(inventory.toString());
            } catch (IOException e) {
                emitter.completeWithError(e);
            }
        }
    }

     */
    public static void updateInventory(Long productId) {
        SseEmitter emitter = emitters.get(productId);
        if (emitter != null) {
            try {
                ProductInfoDTO productInfo = productService.getProductInfo(productId);
                String message = "Brand User ID: " + productInfo.getBrandUserId() +
                        ", Product ID: " + productInfo.getProductId() +
                        ", Total Quantity: " + productInfo.getTotalQuantity();
                emitter.send(message);
            } catch (IOException e) {
                emitter.completeWithError(e);
            }
        }
    }

}
