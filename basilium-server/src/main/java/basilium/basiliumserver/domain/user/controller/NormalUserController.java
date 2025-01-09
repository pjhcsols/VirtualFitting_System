package basilium.basiliumserver.domain.user.controller;

import basilium.basiliumserver.global.auth.support.AuthUser;
import basilium.basiliumserver.domain.deliveryInfo.DeliveryInfo;
import basilium.basiliumserver.domain.user.dto.NormalUserInfoDTO;
import basilium.basiliumserver.domain.user.dto.UserModifiedInfo;
import basilium.basiliumserver.domain.user.service.NormalUserService;
import basilium.basiliumserver.domain.user.entity.JoinStatus;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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