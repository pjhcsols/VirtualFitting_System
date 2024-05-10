package basilium.basiliumserver.util;

import basilium.basiliumserver.auth.jwt.dto.JwtUserInfoDTO;
import basilium.basiliumserver.domain.user.NormalUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import lombok.extern.slf4j.Slf4j;


import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class JwtUtil {

    private static Set<String> blacklistedTokens = new HashSet<>();

    private final SecretKey secretKey;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),
                SignatureAlgorithm.HS256.getJcaName());
    }

    //클레임(Claim)은 JWT(JSON Web Token)의 페이로드(Payload)에 포함되는 정보
    public static String getUserName(String token, String secretKey){
        return Jwts.parser().setSigningKey(secretKey.getBytes()).parseClaimsJws(token)
                .getBody().get("userName", String.class);
    }
    public static String getUserType(String token, String secretKey){
        return Jwts.parser().setSigningKey(secretKey.getBytes()).parseClaimsJws(token)
                .getBody().get("userType", String.class);
    }
    public static boolean isExpired(String token, String secretKey) {
        return Jwts.parser().setSigningKey(secretKey.getBytes()).parseClaimsJws(token)
                .getBody().getExpiration().before(new Date());
    }

    //로그인 할때마다 토큰 새로 발급 리프레쉬 토큰
    //id 값 위주
    public static String createJwt(String userId, String userType, String secretKey, Long expireMs) {
        log.info("*********************************************");
        log.info(userId);
        log.info(userType);
        log.info(secretKey);
        log.info(expireMs.toString());
        Claims claims = Jwts.claims();
        claims.put("userId", userId);
        claims.put("userType", userType);
        log.info("*********************************************");
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expireMs))
                .signWith(SignatureAlgorithm.HS256, secretKey.getBytes())
                .compact();
    }

    //소셜 로그인 id값이 아닌 이메일 값이 필요
    public String createJwt(NormalUser user, Long expireMs) {
        Claims claims = Jwts.claims();
        claims.put("id", user.getId());
        claims.put("userEmail", user.getEmailAddress());
        claims.put("authorities", Arrays.asList("ROLE_HOST_USER")); // 권한 정보 추가

        return buildJwt(expireMs, claims);
    }

    public static boolean isTokenValid(String token, String secretKey) {
        try {
            Jwts.parser().setSigningKey(secretKey.getBytes()).parseClaimsJws(token);
            return !isTokenBlacklisted(token);
        } catch (Exception e) {
            log.error("토큰 검증 실패: {}", e.getMessage());
            return false;
        }
    }

    public static void blacklistToken(String token) {
        if (blacklistedTokens.contains(token)) {
            throw new RuntimeException ("토큰이 이미 블랙리스트에 존재합니다: " + token);
        }
        blacklistedTokens.add(token);
        log.info("토큰 블랙리스트에 추가: {}", token);
    }

    public static boolean isTokenBlacklisted(String token) {

        return blacklistedTokens.contains(token);
    }



    //refresh token 발급
    public String createRefreshToken(NormalUser user, Long expireMs) {
        Claims claims = Jwts.claims();
        claims.put("userEmail", user.getEmailAddress());

        return buildJwt(expireMs, claims);
    }

    private String buildJwt(Long expireMs, Claims claims) {
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expireMs))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }


    public JwtUserInfoDTO getUserInfoFromToken(String token) {
        Claims body = getClaims(token);
        log.info("body : {}", body);
        return JwtUserInfoDTO.builder()
                .id(Long.parseLong(body.getOrDefault("id", "").toString()))
                .userEmail(body.getOrDefault("userEmail", "").toString())
                .userTag(body.getOrDefault("userTag", "").toString())
                .authorities(body.getOrDefault("authorities", "").toString())
                .build();
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String token) {
        try {
            getClaims(token)
                    .getExpiration().before(new Date());
            return !isTokenBlacklisted(token);
        } catch (Exception e) {
            log.error("토큰 검증 실패: {}", e.getMessage());
            return false;
        }
    }


    public Long getUserId(String token) {
        return getClaims(token).get("id", Long.class);
    }

    public String getUserEmail(String token) {
        return getClaims(token)
                .get("userId", String.class);
    }

    public String getUserTag(String token) {
        return getClaims(token)
                .get("userTag", String.class);
    }

    public boolean isTokenExpired(String token) {
        return getClaims(token)
                .getExpiration()
                .before(new Date());
    }

    public String removeBearer(String token) {
        if (token == null || token.trim().isEmpty()) {
            return null;
        }
        return token.replace("Bearer", "").trim();
    }
}