package basilium.basiliumserver.domain.payment.entity;

public enum ReserveStatus {
    ACTIVATED,  // 스케줄러에 등록되어 살아있는 상태
    INACTIVE    // 만료/취소/미등록(맵에 없음)
}

