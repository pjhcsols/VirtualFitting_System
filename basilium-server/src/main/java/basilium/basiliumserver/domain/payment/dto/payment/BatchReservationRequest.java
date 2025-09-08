// src/main/java/basilium/basiliumserver/domain/payment/dto/payment/BatchReservationRequest.java
package basilium.basiliumserver.domain.payment.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Optional;

@Getter @NoArgsConstructor @AllArgsConstructor
public class BatchReservationRequest {
    private List<BatchRequestItem> items;

    // 항상 non-null 컬렉션 반환 (null 비교 연산자 없이)
    public List<BatchRequestItem> getItems() {
        return Optional.ofNullable(items).orElseGet(List::of);
    }
}
