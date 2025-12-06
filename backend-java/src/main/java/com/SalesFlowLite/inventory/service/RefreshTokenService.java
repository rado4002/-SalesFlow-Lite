package com.SalesFlowLite.inventory.service;

import com.SalesFlowLite.inventory.exception.BusinessException;
import com.SalesFlowLite.inventory.exception.ErrorCode;
import com.SalesFlowLite.inventory.model.entity.RefreshToken;
import com.SalesFlowLite.inventory.model.entity.User;
import com.SalesFlowLite.inventory.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${app.jwt.refresh-token-expiration-ms:604800000}") // 7 days
    private long refreshTokenDurationMs;

    private final SecureRandom secureRandom = new SecureRandom();

    // =====================================================
    // CREATE OR REPLACE REFRESH TOKEN
    // =====================================================
    @Transactional
    public RefreshToken createOrReplaceRefreshToken(User user, String deviceInfo) {

        if (user == null)
            throw new BusinessException(ErrorCode.AUTHENTICATION_FAILED, "User cannot be null");

        // Remove existing tokens (one-token-per-user policy)
        refreshTokenRepository.deleteAllByUser(user);

        RefreshToken token = RefreshToken.builder()
                .id(UUID.randomUUID().toString())
                .token(generateTokenValue())
                .user(user)
                .device(deviceInfo)
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusMillis(refreshTokenDurationMs))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(token);
    }

    // =====================================================
    // FIND TOKEN
    // =====================================================
    public Optional<RefreshToken> findByToken(String token) {
        if (token == null || token.isBlank()) return Optional.empty();
        return refreshTokenRepository.findByToken(token);
    }

    // =====================================================
    // VERIFY EXPIRATION
    // =====================================================
    @Transactional
    public boolean verifyExpiration(RefreshToken token) {

        if (token.getExpiresAt().isBefore(Instant.now())) {
            // delete all tokens for that user if expired
            refreshTokenRepository.deleteAllByUser(token.getUser());
            return false;
        }

        return true;
    }

    // =====================================================
    // ROTATE TOKEN
    // =====================================================
    @Transactional
    public RefreshToken rotateRefreshToken(RefreshToken oldToken) {

        oldToken.setRevoked(true);
        refreshTokenRepository.save(oldToken);

        return createOrReplaceRefreshToken(oldToken.getUser(), oldToken.getDevice());
    }

    // =====================================================
    // DELETE SINGLE TOKEN
    // =====================================================
    @Transactional
    public void deleteByToken(String tokenValue) {
        findByToken(tokenValue).ifPresent(refreshTokenRepository::delete);
    }

    // =====================================================
    // DELETE ALL TOKENS FOR USER
    // =====================================================
    @Transactional
    public void deleteByUser(User user) {
        refreshTokenRepository.deleteAllByUser(user);
    }

    // =====================================================
    // RANDOM TOKEN GENERATOR
    // =====================================================
    private String generateTokenValue() {
        byte[] bytes = new byte[48];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
