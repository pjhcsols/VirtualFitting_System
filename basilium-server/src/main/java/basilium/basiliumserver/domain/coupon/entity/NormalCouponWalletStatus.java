// src/main/java/basilium/basiliumserver/domain/coupon/entity/NormalCouponWalletStatus.java
package basilium.basiliumserver.domain.coupon.entity;

public enum NormalCouponWalletStatus {
    AVAILABLE,  // 사용 가능(결제당 1장)
    USED        // 사용 완료(결제 성공 시 즉시 전이)
}
