package com.basilium.redis.product.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Category {
    T_SHIRT(1, "티셔츠"),
    LONG_ARM(2, "긴팔"),
    BLOUSE(3, "블라우스"),
    NEAT(4, "니트"),
    HOODIE(5, "후드티"),
    JEANS(6, "청바지"),
    SLACKS(7, "슬랙스"),
    HALF_PANTS(8, "반바지"),
    SKIRT(9, "스커트"),
    JACKET(10, "자켓"),
    CARDIGAN(11, "가디건"),
    PADDING(12, "패딩"),
    BEST(13, "베스트"),
    DRESS(14, "드레스"),
    SUIT(15, "정장"),
    HANBOK(16, "한복"),
    INNER(17, "속옷"),
    SWIM_SUIT(18, "수영복"),
    ACCESSARY(19, "액세서리");

    private final Integer id;
    private final String categoryName;
}
