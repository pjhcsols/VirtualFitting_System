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
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aspectj.weaver.ast.Or;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class PurchaseTransactionService {

    private final JpaPurchaseTransactionRepo jpaPurchaseTransactionRepo;
    private final JpaNormalUserRepository normalUserRepository;
    private final JpaProductRepository productRepository;
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
}
