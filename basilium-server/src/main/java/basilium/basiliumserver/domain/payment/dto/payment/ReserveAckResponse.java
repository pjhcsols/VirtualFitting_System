// src/main/java/basilium/basiliumserver/domain/payment/dto/payment/ReserveAckResponse.java
package basilium.basiliumserver.domain.payment.dto.payment;

import basilium.basiliumserver.domain.product.entity.Color;
import basilium.basiliumserver.domain.product.entity.Size;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/** 단건·배치 공용 예약 수락 응답 */
@Getter
public class ReserveAckResponse {

    /** 예약 식별자(RID) */
    private final String reserveTaskOrderPayId;

    /** 이 RID의 만료 시각(모든 항목 공통) */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private final LocalDateTime expiresAt;

    /** 요청(또는 누적)된 아이템 목록 — 단건이면 1개, 배치면 N개 (항상 non-null, 불변) */
    private final List<Item> items;

    @Builder
    public ReserveAckResponse(String reserveTaskOrderPayId, LocalDateTime expiresAt, List<Item> items) {
        this.reserveTaskOrderPayId = reserveTaskOrderPayId;
        this.expiresAt = expiresAt;
        this.items = Optional.ofNullable(items).map(List::copyOf).orElseGet(List::of);
    }

    /** 단건용 팩토리: one 이 null 이어도 빈 리스트 반환 */
    public static ReserveAckResponse single(String rid, LocalDateTime expiresAt, Item one) {
        return ReserveAckResponse.builder()
                .reserveTaskOrderPayId(rid)
                .expiresAt(expiresAt)
                .items(Optional.ofNullable(one).map(List::of).orElseGet(List::of))
                .build();
    }

    /** 배치용 팩토리: items null → 빈 리스트, 불변 보장 */
    public static ReserveAckResponse batch(String rid, LocalDateTime expiresAt, List<Item> items) {
        return ReserveAckResponse.builder()
                .reserveTaskOrderPayId(rid)
                .expiresAt(expiresAt)
                .items(Optional.ofNullable(items).map(List::copyOf).orElseGet(List::of))
                .build();
    }

    @Getter
    @Builder
    public static class Item {
        private final Long productId;
        private final Long count;
        private final Size productSize;
        private final Color productColor;
    }
}
