package basilium.basiliumserver.service.purchaseTransaction;

import basilium.basiliumserver.domain.product.Product;
import basilium.basiliumserver.domain.purchaseTransaction.OrderListDAO;
import basilium.basiliumserver.domain.purchaseTransaction.OrderListDTO;
import basilium.basiliumserver.domain.purchaseTransaction.OrderPaymentRequest;
import basilium.basiliumserver.domain.purchaseTransaction.PurchaseTransaction;
import basilium.basiliumserver.domain.user.NormalUser;
import basilium.basiliumserver.repository.product.JpaProductRepository;
import basilium.basiliumserver.repository.purchaseTransaction.JpaPurchaseTransactionRepo;
import basilium.basiliumserver.repository.user.JpaNormalUserRepository;
import basilium.basiliumserver.controller.product.sse.SseController;
import java.util.ArrayList;
import java.util.List;

import basilium.basiliumserver.service.product.ProductService;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

//mq
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;


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
    private final ConcurrentHashMap<Long, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();
    //private final Map<Long, ScheduledFuture<?>> scheduledTasks = new HashMap<>();
    private final ScheduledThreadPoolExecutor scheduler = new ScheduledThreadPoolExecutor(1);



    public List<OrderListDTO> userOrderHistory(Long userId){
        List<OrderListDAO> list = jpaPurchaseTransactionRepo.userOrderHistory(userId);
        List<OrderListDTO> newList = new ArrayList<>();
        for (OrderListDAO item : list){
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
        try{
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
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    //kafka mq
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
