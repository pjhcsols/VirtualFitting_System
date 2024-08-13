package basilium.basiliumserver.controller.user;

import basilium.basiliumserver.auth.support.AuthUser;
import basilium.basiliumserver.domain.deliveryInfo.DeliveryInfo;
import basilium.basiliumserver.domain.user.*;
import basilium.basiliumserver.service.DTO.user.AccessTokenResponse;
import basilium.basiliumserver.service.DTO.user.NormalUserInfoDTO;
import basilium.basiliumserver.service.DTO.user.RefreshTokenRequest;
import basilium.basiliumserver.service.DTO.user.UserModifiedInfo;
import basilium.basiliumserver.service.user.NormalUserService;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//like order payment 분리
@Slf4j
@RestController
@RequestMapping("/normalUser")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class NormalUserController {

    private final NormalUserService normalUserService;


    @PostMapping(value = "/signup")
    public ResponseEntity<String> createNormalUser(@RequestBody NormalUser normalUser) {
        JoinStatus result = normalUserService.join(normalUser);
        return new ResponseEntity<>(result.getMessage(), result.getStatus());
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        String refreshToken = refreshTokenRequest.getRefreshToken();

        if (StringUtils.isBlank(refreshToken)) {
            return ResponseEntity.badRequest().body("리프레시 토큰이 제공되지 않았습니다.");
        }

        if (normalUserService.validateRefreshToken(refreshToken)) {
            String newAccessToken = normalUserService.refreshAccessToken(refreshToken);

            if (newAccessToken != null) {
                return ResponseEntity.ok(new AccessTokenResponse(newAccessToken));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("새로운 액세스 토큰 생성에 실패했습니다.");
            }
        } else {
            return ResponseEntity.badRequest().body("유효하지 않은 리프레시 토큰입니다.");
        }
    }


    @GetMapping("/allNormalUsers")
    public List<NormalUser> getAllNomalUsers() {
        return normalUserService.getAllNormalUsers();
    }


    @PatchMapping("/modify")
    public ResponseEntity<String> modifyUser(@AuthUser String userId, @RequestBody UserModifiedInfo info) {
        NormalUser ret = normalUserService.userInfoById(userId);
        ret.setName(info.getName());
        ret.setEmailAddress(info.getEmailAddress());
        ret.setPhoneNumber(info.getPhoneNumber());
        ret.setPassword(info.getPassword());

        System.out.println(info.getName());
        System.out.println(info.getPhoneNumber());
        System.out.println(info.getEmailAddress());
        System.out.println(info.getPassword());
        normalUserService.modify(ret);

        return ResponseEntity.ok("성공적으로 변경되었습니다.");
    }

    @PostMapping("/review")
    public ResponseEntity<String> writeReview(Authentication authentication){
        return ResponseEntity.ok().body(authentication.getName() + "님의 리뷰 등록이 완료되었습니다.");
    }

    @GetMapping("/userInfo")
    public ResponseEntity<NormalUser> userInfo(@AuthUser String userId){
        NormalUser ret = normalUserService.userInfoById(userId);
        return ResponseEntity.ok(ret);
    }

    @GetMapping("/user/detail")
    public ResponseEntity<NormalUserInfoDTO> userDetailInfo(@AuthUser String userId){
        NormalUser ret = normalUserService.userInfoById(userId);
        System.out.println(ret.getUserNumber());
        DeliveryInfo info = normalUserService.deliveryInfoByUserNumber(ret.getUserNumber());

        return ResponseEntity.ok(new NormalUserInfoDTO(ret, info));
    }
}