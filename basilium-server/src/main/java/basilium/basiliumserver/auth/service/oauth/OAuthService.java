package basilium.basiliumserver.auth.service.oauth;


import basilium.basiliumserver.auth.dto.SocialAuthResponse;
import basilium.basiliumserver.auth.dto.SocialLoginRequest;
import basilium.basiliumserver.auth.dto.SocialUserResponse;
import basilium.basiliumserver.auth.dto.TokenResponse;
import basilium.basiliumserver.auth.entity.Provider;
import basilium.basiliumserver.auth.exception.AuthException;
import basilium.basiliumserver.auth.exception.AuthExceptionType;
import basilium.basiliumserver.domain.user.Grade;
import basilium.basiliumserver.domain.user.NormalUser;
import basilium.basiliumserver.repository.user.JpaNormalUserRepository;
import basilium.basiliumserver.util.JwtUtil;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OAuthService {

    @Value("${jwt.expiredMs}")
    private Long expiredMs;

    private final List<SocialLoginService> loginServices;
    private final JpaNormalUserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Transactional
    public TokenResponse doSocialLogin(SocialLoginRequest request, Provider provider) {
        SocialLoginService loginService = getLoginService(provider);
        SocialAuthResponse socialAuthResponse = loginService.getAccessToken(request.code());
        SocialUserResponse socialUserResponse = loginService.getUserInfo(socialAuthResponse.getAccess_token());

        Optional<NormalUser> optionalUser = userRepository.findByEmail(socialUserResponse.userEmail());
        NormalUser user;
        log.info("socialUserResponse.userEmail() : {}", socialUserResponse.userEmail());
        log.info("socialUserResponse.userName() : {}", socialUserResponse.userName());

        if (optionalUser.isEmpty()) {
            NormalUser newUser = new NormalUser();
            newUser.setEmailAddress(socialUserResponse.userEmail());
            newUser.setName(socialUserResponse.userName());
            newUser.setUserGrade(Grade.BRONZE);
            newUser.setLoginType(loginService.getServiceName());
            user = join(newUser, loginService);
        } else {
            user = optionalUser.get();
        }
        //토근발급
        String accessToken = jwtUtil.createJwt(user, expiredMs);
        String refreshToken = jwtUtil.createRefreshToken(user, expiredMs * 10);
        return new TokenResponse(accessToken, refreshToken);
    }

    private SocialLoginService getLoginService(Provider provider) {
        for (SocialLoginService loginService : loginServices) {
            if (provider.equals(loginService.getServiceName())) {
                log.info("로그인 서비스 : {}", loginService.getServiceName());
                return loginService;
            }
        }
        throw new AuthException(AuthExceptionType.UNSUPPORTED_LOGIN_PROVIDER);
    }

    private NormalUser join(NormalUser user, SocialLoginService loginService) {


        NormalUser newUser = new NormalUser();
        newUser.setEmailAddress(user.getEmailAddress());
        newUser.setName(user.getName());
        newUser.setPhoneNumber(user.getPhoneNumber());
        newUser.setUserGrade(Grade.BRONZE);
        newUser.setLoginType(loginService.getServiceName());
        return userRepository.save(newUser);
    }
}