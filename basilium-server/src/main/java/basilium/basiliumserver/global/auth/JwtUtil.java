package basilium.basiliumserver.global.auth;

import basilium.basiliumserver.properties.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.*;

@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;
    private final Set<String> blacklistedTokens = Collections.newSetFromMap(new java.util.concurrent.ConcurrentHashMap<>());

    public JwtUtil(JwtProperties jwtProperties) {
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.secret());
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        this.accessTokenExpiration = jwtProperties.accessTokenValidity();
        this.refreshTokenExpiration = jwtProperties.refreshTokenValidity();
    }

    public Optional<String> removeBearer(String header) {
        return Optional.ofNullable(header)
                .map(String::trim)
                .filter(h -> !h.isEmpty())
                .filter(h -> h.startsWith("Bearer "))
                .map(h -> h.substring("Bearer ".length()).trim())
                .filter(h -> !h.isEmpty());
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

    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String getUserId(String token) {
        return getClaims(token).getSubject();
    }

    public boolean validateRefreshToken(String token) {
        try {
            Claims claims = Jwts.parser().verifyWith(secretKey).build()
                    .parseSignedClaims(token).getPayload();
            return claims.getExpiration().after(new Date()) && claims.get("role") == null;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean validateToken(String token) {
        if (isTokenBlacklisted(token)) return false;
        try {
            Claims claims = Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
            return claims.get("role") != null;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

}
