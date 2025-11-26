package com.SalesFlowLite.inventory.security;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.*;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class JwtUtil {

    private static final Path SECRET_PATH = Paths.get("jwt-secret.key");
    private String secretBase64;

    @PostConstruct
    public void init() {
        this.secretBase64 = loadOrCreateSecret();
    }

    private String loadOrCreateSecret() {
        try {
            // 1. Read existing secret
            if (Files.exists(SECRET_PATH)) {
                String existing = Files.readString(SECRET_PATH).trim();
                if (!existing.isEmpty()) {
                    return existing;
                }
            }

            // 2. Generate 256-bit secret
            byte[] keyBytes = new byte[32];
            new SecureRandom().nextBytes(keyBytes);
            String secret = Base64.getEncoder().encodeToString(keyBytes);

            // 3. Write secret to file (Windows-friendly)
            Files.writeString(
                    SECRET_PATH,
                    secret,
                    StandardOpenOption.CREATE,
                    StandardOpenOption.TRUNCATE_EXISTING
            );

            System.out.println("Generated new JWT secret at " + SECRET_PATH.toAbsolutePath());
            return secret;

        } catch (IOException e) {
            throw new IllegalStateException("Failed to load or create JWT secret file", e);
        }
    }

    public byte[] getSecretBytes() {
        return Base64.getDecoder().decode(secretBase64);
    }

    public String getSecretBase64() {
        return secretBase64;
    }
}
