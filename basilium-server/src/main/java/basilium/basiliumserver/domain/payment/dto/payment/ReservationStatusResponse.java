// src/main/java/basilium/basiliumserver/domain/payment/dto/payment/ReservationStatusResponse.java
package basilium.basiliumserver.domain.payment.dto.payment;

import basilium.basiliumserver.domain.payment.entity.ReserveStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Optional;

@Getter
@AllArgsConstructor
public class ReservationStatusResponse {
    private final String reserveTaskOrderPayId;
    private final ReserveStatus status; // ACTIVATED | INACTIVE
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private final Optional<LocalDateTime> expiresAt; // INACTIVE면 empty
}
