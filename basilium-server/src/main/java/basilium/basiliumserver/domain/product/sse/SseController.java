package basilium.basiliumserver.domain.product.sse;

import basilium.basiliumserver.domain.product.dto.ProductInfoDTO;
import basilium.basiliumserver.domain.product.service.ProductService;
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
        this.productService = productService;
    }

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
/*
    @GetMapping("/subscribe/{productId}")
    public SseEmitter subscribeInventory(@PathVariable Long productId) {
        SseEmitter emitter = new SseEmitter();

        // 클라이언트 연결이 종료되었을 때 처리
        emitter.onCompletion(() -> {
            emitters.remove(productId);
        });

        // 클라이언트 연결이 timeout 되었을 때 처리
        emitter.onTimeout(() -> {
            emitters.remove(productId);
            emitter.complete();
        });

        emitters.put(productId, emitter);
        return emitter;
    }

 */

    @PostMapping("/unsubscribe/{productId}")
    public void unsubscribeInventory(@PathVariable Long productId) {
        SseEmitter emitter = emitters.remove(productId);
        if (emitter != null) {
            emitter.complete();
        }
    }

    // 재고가 변경될 때 SSE를 통해 구독자에게 즉시 업데이트하는 메서드
    public static void updateInventory(Long productId) {
        SseEmitter emitter = emitters.get(productId);
        if (emitter != null) {
            try {
                ProductInfoDTO productInfo = productService.getProductInfo(productId);
                String message = "Brand User ID: " + productInfo.getBrandUserId() +
                        ", Product ID: " + productInfo.getProductId() +
                        ", Total Quantity: " + productInfo.getTotalQuantity();
                emitter.send(SseEmitter.event().data(message));
            } catch (IOException e) {
                emitter.completeWithError(e);
            }
        }
    }
}



/*
@RestController
@RequestMapping("/inventory")
public class SseController {

    private static final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();
    private static ProductService productService;

    @Autowired
    public SseController(ProductService productService) {
        SseController.productService = productService;
    }

    //계속 커넥션 들고있는 건 sse보단 롱폴링임 이거 리팩토링하기
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
 */

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



