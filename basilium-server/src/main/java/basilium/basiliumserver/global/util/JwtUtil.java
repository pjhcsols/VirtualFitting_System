package basilium.basiliumserver.global.util;

import basilium.basiliumserver.properties.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;
    private final Set<String> blacklistedTokens = new HashSet<>();

    // JwtProperties를 주입받아 초기화합니다.
    public JwtUtil(JwtProperties jwtProperties) {
        // jwtProperties.secret()는 Base64 문자열이어야 합니다(32바이트 이상)
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.secret());
        this.secretKey = Keys.hmacShaKeyFor(keyBytes); // HmacSHA256 키 생성

        this.accessTokenExpiration = jwtProperties.accessTokenValidity();
        this.refreshTokenExpiration = jwtProperties.refreshTokenValidity();
    }

    public String removeBearer(String token) {
        if (token == null || token.trim().isEmpty()) {
            return null;
        }
        return token.replace("Bearer", "").trim();
    }

    public boolean isTokenExpired(String token) {
        return getClaims(token)
                .getExpiration()
                .before(new Date());
    }

    public String createJwt(String userId, String userType) {
        return Jwts.builder()
                .subject(userId)
                .claim("role", userType)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(secretKey)
                .compact();
    }

    public String createRefreshToken(String userId) {
        return Jwts.builder()
                .subject(userId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(secretKey)
                .compact();
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }

    public void blacklistToken(String token) {
        blacklistedTokens.add(token);
    }

    public String getUserId(String token) {
        return getClaims(token).getSubject();
    }

    /*
    public Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
    }
     */
    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)   // setSigningKey → verifyWith
                .build()                 // 빌더 마무리
                .parseSignedClaims(token) // parseClaimsJws → parseSignedClaims
                .getPayload();           // getBody → getPayload
    }

    /*
    public boolean validateToken(String token) {
        if (isTokenBlacklisted(token)) {
            return false;
        }

        try {
            Claims claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();

            // role 정보가 있는지 확인 (액세스 토큰일 경우)
            return claims.get("role") != null;
        } catch (Exception e) {
            return false;
        }
    }
     */
    public boolean validateToken(String token) {
        if (isTokenBlacklisted(token)) {
            return false;
        }
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            // role 정보가 있는지 확인 (액세스 토큰일 경우)
            return claims.get("role") != null;
        } catch (Exception e) {
            return false;
        }
    }


    /*
    public boolean validateRefreshToken(String token) {
        // 리프레시 토큰의 유효성만을 검증합니다.
        try {
            Claims claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();

            // 리프레시 토큰에는 role 정보가 없어야 함
            return claims.getExpiration().after(new Date()) && claims.get("role") == null;
        } catch (Exception e) {
            return false;
        }
    }
     */
    public boolean validateRefreshToken(String token) {
        // 리프레시 토큰의 유효성만을 검증합니다.
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            // 리프레시 토큰에는 role 정보가 없어야 함
            return claims.getExpiration().after(new Date()) && claims.get("role") == null;
        } catch (Exception e) {
            return false;
        }
    }

}