package basilium.basiliumserver.util;

import basilium.basiliumserver.properties.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
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
        this.secretKey = new SecretKeySpec(jwtProperties.secret().getBytes(StandardCharsets.UTF_8),
                SignatureAlgorithm.HS256.getJcaName());
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
                .setSubject(userId)
                .claim("role", userType)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public String createRefreshToken(String userId) {
        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(SignatureAlgorithm.HS256, secretKey)
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

    public Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
    }

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

}