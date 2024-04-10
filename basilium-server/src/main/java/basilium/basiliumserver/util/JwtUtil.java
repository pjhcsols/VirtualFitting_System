package basilium.basiliumserver.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;


import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Slf4j
public class JwtUtil {
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
    public static String createJwt(String userName, String userType, String secretKey, Long expireMs) {
        log.info("*********************************************");
        log.info(userName);
        log.info(userType);
        log.info(secretKey);
        log.info(expireMs.toString());
        Claims claims = Jwts.claims();
        claims.put("userName", userName);
        claims.put("userType", userType);
        log.info("*********************************************");
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expireMs))
                .signWith(SignatureAlgorithm.HS256, secretKey.getBytes())
                .compact();
    }


    //블랙리스트
    private static Set<String> blacklistedTokens = new HashSet<>();

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
}