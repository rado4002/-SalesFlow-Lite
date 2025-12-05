// src/main/java/com/SalesFlowLite/inventory/security/JwtService.java
package com.SalesFlowLite.inventory.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.SalesFlowLite.inventory.model.entity.User;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.access-token-expiration-ms:3600000}")
    private long accessTokenExpirationMs;

    @Value("${app.jwt.refresh-token-expiration-ms:1209600000}")
    private long refreshTokenExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(String phoneNumber, String role, String username) {
        return Jwts.builder()
                .setSubject(phoneNumber)
                .setIssuer("salesflow-app")
                .claim("role", role)
                .claim("username", username)
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .setSubject(user.getPhoneNumber())
                .setIssuer("salesflow-app")
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getRefreshExpiresAt() {
        return Instant.now().plusMillis(refreshTokenExpirationMs).toString();
    }

    public String extractPhoneNumber(String token) {
        return extractClaims(token).getSubject();
    }

    public String extractUsername(String token) {
        return extractClaims(token).get("username", String.class);
    }

    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    public boolean isAccessTokenValid(String token, String expectedPhoneNumber) {
        try {
            String phone = extractPhoneNumber(token);
            return phone != null && phone.equals(expectedPhoneNumber) && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isRefreshTokenValid(String token) {
        try {
            Claims claims = extractClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public long getRefreshTokenExpirationMs() {
        return refreshTokenExpirationMs;
    }

    public String extractJwtFromHeader(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        return authHeader.substring(7);
    }
}