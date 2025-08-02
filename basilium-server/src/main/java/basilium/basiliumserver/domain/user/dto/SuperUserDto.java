package basilium.basiliumserver.domain.user.dto;

public record SuperUserDto(
        Long userNumber,
        String id,
        String name,
        String position,
        String department,
        String jobRole
) {}

