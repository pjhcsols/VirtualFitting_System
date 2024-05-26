package basilium.basiliumserver.payment;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//결제시간도 포함 들고있기 아임포트
//프론트에서 결제 완료후 결제 상태 저장
//아임포트 api사용해서 결제 내역 조회
//결제 취소 등등
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long price;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private String paymentUid; // 결제 고유 번호 아임포트에서 저장하기

}

/*
    @Builder
    public Payment(Long price, PaymentStatus status) {
        this.price = price;
        this.status = status;
    }
    public void changePaymentBySuccess(PaymentStatus status, String paymentUid) {
        this.status = status;
        this.paymentUid = paymentUid;
    }
}

 */

