package basilium.basiliumserver.domain.product.paymentInventory;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.UUID;

//클라이언트 request시에 스케줄러 delay와 requestId를 함께 전송하기 위한 DTO
public class PaymentInventoryResponse {
    private UUID requestId;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime delayTime;
    //private long delay;

    public PaymentInventoryResponse(UUID requestId, LocalDateTime delayTime) {
        this.requestId = requestId;
        this.delayTime = delayTime;
    }

    public UUID getRequestId() {
        return requestId;
    }

    public void setRequestId(UUID requestId) {
        this.requestId = requestId;
    }

    public LocalDateTime getDelayTime() {
        return delayTime;
    }

    public void setDelayTime(LocalDateTime delayTime) {
        this.delayTime = delayTime;
    }
}
    //LocalDateTime delayTime = LocalDateTime.now().plusSeconds(delay);
    /*
    public PaymentInventoryResponse(UUID requestId, long delay) {
        this.requestId = requestId;
        this.delay = delay;
    }

    public UUID getRequestId() {
        return requestId;
    }

    public void setRequestId(UUID requestId) {
        this.requestId = requestId;
    }

    public long getDelay() {
        return delay;
    }

    public void setDelay(long delay) {
        this.delay = delay;
    }

     */


