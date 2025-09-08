// src/main/java/basilium/basiliumserver/domain/payment/dto/payment/RequestTaskInfo.java
package basilium.basiliumserver.domain.payment.dto.payment;

import basilium.basiliumserver.domain.product.entity.Color;
import basilium.basiliumserver.domain.product.entity.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

/** 예약 스케줄러가 알아야 할 최소 정보 (RID 하위 아이템 단위) */
@AllArgsConstructor @Getter @ToString
public class RequestTaskInfo {
    private final String userId;
    private final Long productId;
    private final Long count;
    private final Size productSize;
    private final Color productColor;
}
