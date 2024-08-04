package basilium.basiliumserver.service.purchaseTransaction;

import basilium.basiliumserver.controller.payment.PaymentController;
import basilium.basiliumserver.domain.product.Product;
import basilium.basiliumserver.domain.purchaseTransaction.kafkaPaymentInventory.PaymentInventoryResponse;
import basilium.basiliumserver.domain.purchaseTransaction.OrderListDAO;
import basilium.basiliumserver.domain.purchaseTransaction.OrderListDTO;
import basilium.basiliumserver.domain.purchaseTransaction.OrderPaymentRequest;
import basilium.basiliumserver.domain.purchaseTransaction.PurchaseTransaction;
import basilium.basiliumserver.domain.user.NormalUser;
import basilium.basiliumserver.repository.product.JpaProductRepository;
import basilium.basiliumserver.repository.purchaseTransaction.JpaPurchaseTransactionRepo;
import basilium.basiliumserver.repository.user.JpaNormalUserRepository;
import basilium.basiliumserver.controller.product.sse.SseController;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import basilium.basiliumserver.service.product.ProductService;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

//mq
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;


//order와 puchaseTrancsaction 분리
@Service
@RequiredArgsConstructor
@Slf4j
public class PurchaseTransactionService {

    private final JpaPurchaseTransactionRepo jpaPurchaseTransactionRepo;
    private final JpaNormalUserRepository normalUserRepository;
    private final JpaProductRepository productRepository;

    private final ProductService productService;
    //rabbit mq
    //private final ConcurrentHashMap<Long, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();
    //private final ScheduledThreadPoolExecutor scheduler = new ScheduledThreadPoolExecutor(1);

    //kafka mq
    //private final ConcurrentHashMap<Long, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();
    private final ScheduledThreadPoolExecutor scheduler = new ScheduledThreadPoolExecutor(1);
    // 작업 식별을 위한 맵: Map<productId, Map<UUID, ScheduledFuture<?>>>
    private final ConcurrentHashMap<Long, ConcurrentHashMap<UUID, ScheduledFuture<?>>> scheduledTasks = new ConcurrentHashMap<>();


    public List<OrderListDTO> userOrderHistory(Long userId) {
        List<OrderListDAO> list = jpaPurchaseTransactionRepo.userOrderHistory(userId);
        List<OrderListDTO> newList = new ArrayList<>();
        for (OrderListDAO item : list) {
            OrderListDTO temp = new OrderListDTO();
            temp.setSize(item.getSize());
            temp.setColor(item.getColor());
            temp.setPrice(item.getPrice());
            temp.setPhotoUrl(jpaPurchaseTransactionRepo.productPhotoUrl(item.getProductId()));
            temp.setCreationTime(item.getCreationTime());
            temp.setProductName(item.getProductName());
            temp.setPrice(item.getPrice());
            temp.setProductId(item.getProductId());
            temp.setTotalCnt(item.getTotalCnt());
            newList.add(temp);
        }

        return newList;
    }

    @Transactional
    public void processPayment(String userId, String impUid, OrderPaymentRequest request) {
        try {
            List<PurchaseTransaction> transactions = new ArrayList<>();

            request.getInventoryList().forEach(item -> {
                PurchaseTransaction transaction = new PurchaseTransaction();
                transaction.setColor(item.getColor());
                transaction.setSize(item.getSize());
                transaction.setPaymentType("CARD");
                transaction.setTotalCnt(item.getCnt());
                transaction.setImpUId(impUid); // Here we use the impUid parameter directly
                NormalUser user = normalUserRepository.findById(userId).get();
                transaction.setNormalUser(user);
                Product product = productRepository.findById(item.getProductId()).get();
                transaction.setProduct(product);
                transactions.add(transaction);
            });

            for (PurchaseTransaction transaction : transactions) {
                jpaPurchaseTransactionRepo.savePurchaseTransaction(transaction); // Using the standard save method from JpaRepository
                System.out.println(transaction.toString());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    //kafka mq
    // Method to schedule restoration and return DTO
    public PaymentInventoryResponse scheduleRestoration(Long productId, Long count, UUID taskId) {
        ConcurrentHashMap<UUID, ScheduledFuture<?>> tasks = scheduledTasks.getOrDefault(productId, new ConcurrentHashMap<>());
        if (!tasks.containsKey(taskId)) {
            ScheduledFuture<?> scheduledTask = scheduler.schedule(() -> {
                productService.restoreProductQuantity(productId, count);
                removeScheduledTask(productId, taskId);
                log.info("[상품 수량 복구, 결제 시간 5분 초과] productId: {}, count: {}", productId, count);
                log.info("[서비스-예약 스케줄러 메모리 해제 후]: Getting scheduled tasks - size: {}", scheduledTasks.size());
                SseController.updateInventory(productId);
                PaymentController.removeControllerMap(taskId);
            }, 1, TimeUnit.MINUTES);

            addScheduledTask(productId, taskId, scheduledTask);

            long delay = scheduledTask.getDelay(TimeUnit.SECONDS);
            LocalDateTime delayTime = LocalDateTime.now().plusSeconds(delay);
            return new PaymentInventoryResponse(taskId, delayTime);
        } else {
            //컨트롤러에서 한번은 카프카 한번은 서비스로 요청을 하는데 이미 값이 존재해서 else로 넘어감
            //이거 리팩토링하기
            log.info("이거 설마 두번 호출??");
            ScheduledFuture<?> existingTask = tasks.get(taskId);
            long delay = existingTask.getDelay(TimeUnit.SECONDS);
            LocalDateTime delayTime = LocalDateTime.now().plusSeconds(delay);
            return new PaymentInventoryResponse(taskId, delayTime);
        }
    }
    /*
    // 예약된 작업을 추가하고 타이머 정보를 반환하는 메서드
    public String scheduleRestoration(Long productId, Long count, UUID taskId) {
        ConcurrentHashMap<UUID, ScheduledFuture<?>> tasks = scheduledTasks.getOrDefault(productId, new ConcurrentHashMap<>());
        if (!tasks.containsKey(taskId)) { // 이미 해당 작업이 예약되어 있는지 확인
            ScheduledFuture<?> scheduledTask = scheduler.schedule(() -> {
                productService.restoreProductQuantity(productId, count);
                removeScheduledTask(productId, taskId); // 서비스 메모리 누수 해결
                log.info("[상품 수량 복구, 결제 시간 5분 초과] productId: {}, count: {}", productId, count);
                log.info("[서비스-예약 스케줄러 메모리 해제 후]: Getting scheduled tasks - size: {}", scheduledTasks.size());
                SseController.updateInventory(productId);
                PaymentController.removeControllerMap(taskId); // 컨트롤러 메모리 누수 해결
            }, 1, TimeUnit.MINUTES); // 실제 운영시 5분으로 설정 // 5분 지나면 클라이언트에게 결제 종료 메시지 보내기

            addScheduledTask(productId, taskId, scheduledTask);

            long delay = scheduledTask.getDelay(TimeUnit.SECONDS);
            LocalDateTime delayTime = LocalDateTime.now().plusSeconds(delay); //변환
            return String.format("요청 ID: %s, 예정된 실행까지 남은 시간: %s", taskId.toString(), delayTime);
            //return String.format("요청 ID: %s, 예정된 실행까지 남은 시간: %d 초", taskId.toString(), delay);
        } else {
            // 이미 예약된 작업이 있을 경우 해당 작업의 남은 시간을 반환
            ScheduledFuture<?> existingTask = tasks.get(taskId);
            long delay = existingTask.getDelay(TimeUnit.SECONDS);
            return String.format("이미 예약된 작업입니다. 예정된 실행까지 남은 시간: %d 초", delay);
        }
    }

     */

    // 예약된 작업을 추가하는 메서드
    /*
    public void scheduleRestoration(Long productId, Long count, UUID taskId) {
        ConcurrentHashMap<UUID, ScheduledFuture<?>> tasks = scheduledTasks.getOrDefault(productId, new ConcurrentHashMap<>());
        if (!tasks.containsKey(taskId)) { // 이미 해당 작업이 예약되어 있는지 확인
            ScheduledFuture<?> scheduledTask = scheduler.schedule(() -> {
                productService.restoreProductQuantity(productId, count);
                removeScheduledTask(productId, taskId); //서비스 메모리 누수 해결
                log.info("[상품 수량 복구, 결제 시간 5분 초과] productId: {}, count: {}", productId, count);
                log.info("[서비스-예약 스케줄러 메모리 해제 후]:Getting scheduled tasks - size: {}", scheduledTasks.size());
                SseController.updateInventory(productId);
                PaymentController.removeControllerMap(taskId); //컨트롤러 메모리 누수 해결
            }, 1, TimeUnit.MINUTES); // 실제 운영시 5분으로 설정 //5분 지나면 클라이언트에게 결제 종료 메시지 보내기
            addScheduledTask(productId, taskId, scheduledTask);
        }
    }

     */

    // 특정 작업을 취소하는 메서드
    public void processPaymentResponse(Long productId, Long count, boolean success, UUID taskId) {
        if (success) {
            cancelScheduledTask(productId, taskId); //서비스 메모리 누수 해결
            log.info("[true 서비스-예약 스케줄러 메모리 해제 후]:Getting scheduled tasks - size: {}", scheduledTasks.size());
            log.info("[결제성공(true): 상품 수량 복구 취소->일괄 처리 작업 취소] ");
        } else {
            log.info("[결제취소(false)응답: 상품 수량 즉시 복구] ");
            restoreProductQuantity(productId, count);
            cancelScheduledTask(productId, taskId); //서비스 메모리 누수 해결
            log.info("[false 서비스-예약 스케줄러 메모리 해제 후]:Getting scheduled tasks - size: {}", scheduledTasks.size());
            SseController.updateInventory(productId);
            log.info("[결제실패(false)응답: 상품 수량 복구 완료->일괄 처리 작업 취소] ");
        }
    }

    private void addScheduledTask(Long productId, UUID taskId, ScheduledFuture<?> task) {
        scheduledTasks.computeIfAbsent(productId, k -> new ConcurrentHashMap<>()).put(taskId, task);
    }

    //메모리 할당 해제
    private void removeScheduledTask(Long productId, UUID taskId) {
        scheduledTasks.computeIfPresent(productId, (key, tasks) -> {
            log.info("[서비스-예약 스케줄러 메모리 해제 전]:Getting scheduled tasks - size: {}", scheduledTasks.size());
            tasks.remove(taskId);
            //log.info("[서비스-예약 스케줄러 메모리 해제 후]:Getting scheduled tasks - size: {}", scheduledTasks.size());
            return tasks.isEmpty() ? null : tasks;
        });
    }

    //메모리 할당 해제 + 작업취소
    private void cancelScheduledTask(Long productId, UUID taskId) {
        ConcurrentHashMap<UUID, ScheduledFuture<?>> tasks = scheduledTasks.get(productId);
        if (tasks != null) {
            log.info("[서비스-취소 스케줄러 메모리 해제 전]: Getting scheduled tasks - size: {}", scheduledTasks.size());
            ScheduledFuture<?> task = tasks.remove(taskId);
            //log.info("[서비스-취소 스케줄러 메모리 해제 후]: Getting scheduled tasks - size: {}", scheduledTasks.size());
            if (task != null) {
                task.cancel(false);
            }
        }
    }

    public void restoreProductQuantity(Long productId, Long count) {
        productService.restoreProductQuantity(productId, count);
    }



    /*
    //프론트 결제창 5분 설정하기
    public void scheduleRestoration(Long productId, Long count) {

        ScheduledFuture<?> scheduledTask = scheduler.schedule(() -> {
            productService.restoreProductQuantity(productId, count);
            scheduledTasks.remove(productId);
            log.info("[상품 수량 복구, 결제 시간 5분 초과] Restoration scheduled for productId: {}, count: {}", productId, count);
            SseController.updateInventory(productId); //sse를 통한 구독한 재고 변경 실시간 전송
        }, 1, TimeUnit.MINUTES); //5분 설정하기(테스트용1분)

        scheduledTasks.put(productId, scheduledTask);
    }

    public void processPaymentResponse(Long productId, Long count, boolean success) {
        //결제 성공 응답
        //결제가 성공했을 경우에는 해당 상품에 대한 예약된 스케줄링된 작업을 취소합니다.
        //scheduledTasks 맵에서 해당 상품에 대한 스케줄링된 작업을 제거합니다.
        //취소할 작업이 존재하고, 이를 취소할 수 있으면(scheduledTask != null) 작업을 취소합니다.
        if (success) {
            ScheduledFuture<?> scheduledTask = scheduledTasks.remove(productId);
            if (scheduledTask != null) {
                scheduledTask.cancel(false); //한번은 취소되는데 두번 스케줄러에 쌓여있을때 삭제안됨
            }
            log.info("[결제성공(true) scheduledTask: 상품 수량 복구 취소->일괄 처리 작업 취소] ");
        } else {
            //결제 실패 응답
            log.info("[결제취소(false)응답: 상품 수량 즉시 복구] ");
            restoreProductQuantity(productId, count);
            log.info("Restoration scheduled for productId: {}, count: {}", productId, count);
            // 변경된 부분: 결제 실패 시에는 재고를 즉시 복구하고 프론트에게 재고 수량을 알려줍니다.

            //sse를 통한 구독한 재고 변경 실시간 전송
            SseController.updateInventory(productId);
            // 스케줄링된 작업을 취소합니다.
            ScheduledFuture<?> scheduledTask = scheduledTasks.remove(productId);
            if (scheduledTask != null) {
                scheduledTask.cancel(false);
            }
            log.info("[결제실패(false)응답: scheduledTask: 상품 수량 복구 완료->일괄 처리 작업 취소] ");
        }
    }

    public void restoreProductQuantity(Long productId, Long count) {
        productService.restoreProductQuantity(productId, count);
    }

     */



    /*
    //rabbit mq
    public void scheduleRestoration(Long productId, Long count) {
        ScheduledFuture<?> scheduledTask = scheduler.schedule(() -> {
            productService.restoreProductQuantity(productId, count);
            scheduledTasks.remove(productId);
        }, 10, TimeUnit.MINUTES);

        scheduledTasks.put(productId, scheduledTask);
    }

    public void processPaymentResponse(Long productId, Long count, boolean success) {
        if (success) {
            // 결제 성공 시, 복구 작업 취소
            ScheduledFuture<?> scheduledTask = scheduledTasks.remove(productId);
            if (scheduledTask != null) {
                scheduledTask.cancel(false);
            }
        } else {
            // 결제 실패 시, 이미 예약된 복구 작업은 그대로 두고 이후 자동 실행되도록
            scheduleRestoration(productId, count);
        }
    }

     */
}
