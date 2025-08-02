// src/main/java/basilium/basiliumserver/domain/user/dto/MyBannerDto.java
package basilium.basiliumserver.domain.user.dto;

public record MyBannerDto(
        Long userNumber,
        String fileName,
        String url
) {}
