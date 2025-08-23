// src/main/java/basilium/basiliumserver/domain/coupon/entity/BrandCouponCampaignStatus.java
package basilium.basiliumserver.domain.coupon.entity;

public enum BrandCouponCampaignStatus {
    SCHEDULED,  // 시작 전
    ACTIVE,     // 진행 중
    EXPIRED     // 종료됨(배치가 지갑 삭제, 캠페인은 보관 후 purge)
}
