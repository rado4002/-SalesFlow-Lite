// src/main/java/com/SalesFlowLite/inventory/controller/AuthController.java
package com.SalesFlowLite.inventory.controller;
import com.SalesFlowLite.inventory.model.entity.Role;
import com.SalesFlowLite.inventory.model.dto.auth.*;
import com.SalesFlowLite.inventory.model.entity.RefreshToken;
import com.SalesFlowLite.inventory.model.entity.User;
import com.SalesFlowLite.inventory.security.JwtService;
import com.SalesFlowLite.inventory.service.AuthService;
import com.SalesFlowLite.inventory.service.RefreshTokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    // ---------------------------------------------------------
    // LOGIN
    // ---------------------------------------------------------
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = authService.validateCredentials(request.getPhoneNumber(), request.getPassword());

        String accessToken = jwtService.generateAccessToken(
                user.getPhoneNumber(),
                user.getRole().name(),
                user.getUsername()
        );

        String refreshToken = jwtService.generateRefreshToken(user);
        String refreshExpiresAt = jwtService.getRefreshExpiresAt();

        refreshTokenService.createOrReplaceRefreshToken(user, "web");

        AuthResponse response = AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .refreshExpiresAt(refreshExpiresAt)
                .tokenType("Bearer")
                .message("Login successful")
                .user(user)
                .build();

        return ResponseEntity.ok(response);
    }

    // ---------------------------------------------------------
    // REGISTER
    // ---------------------------------------------------------
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (authService.existsByPhoneNumber(request.getPhoneNumber())) {
            return ResponseEntity.badRequest()
                    .body(AuthResponse.builder()
                            .message("Phone number already registered")
                            .build());
        }

        User newUser = User.builder()
                .phoneNumber(request.getPhoneNumber())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(authService.encodePassword(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.USER)
                .build();

        User savedUser = authService.saveUser(newUser);

        String accessToken = jwtService.generateAccessToken(
                savedUser.getPhoneNumber(),
                savedUser.getRole().name(),
                savedUser.getUsername()
        );

        String refreshToken = jwtService.generateRefreshToken(savedUser);
        String refreshExpiresAt = jwtService.getRefreshExpiresAt();

        refreshTokenService.createOrReplaceRefreshToken(savedUser, "web");

        AuthResponse response = AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .refreshExpiresAt(refreshExpiresAt)
                .tokenType("Bearer")
                .message("Registration successful")
                .user(savedUser)
                .build();

        return ResponseEntity.ok(response);
    }

    // ---------------------------------------------------------
    // REFRESH TOKEN (SECURE + ROTATION)
    // ---------------------------------------------------------
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody TokenRefreshRequest request) {
        String providedRefresh = request.getRefreshToken();
        if (providedRefresh == null || providedRefresh.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(AuthResponse.builder()
                            .message("Refresh token is required")
                            .build());
        }

        RefreshToken storedToken = refreshTokenService.findByToken(providedRefresh)
                .orElse(null);
        if (storedToken == null) {
            return ResponseEntity.status(401)
                    .body(AuthResponse.builder()
                            .message("Invalid refresh token")
                            .build());
        }

        if (!refreshTokenService.verifyExpiration(storedToken)) {
            return ResponseEntity.status(401)
                    .body(AuthResponse.builder()
                            .message("Refresh token expired")
                            .build());
        }

        User user = storedToken.getUser();
        RefreshToken newStoredToken = refreshTokenService.rotateRefreshToken(storedToken);

        String newAccess = jwtService.generateAccessToken(
                user.getPhoneNumber(),
                user.getRole().name(),
                user.getUsername()
        );
        String newRefresh = jwtService.generateRefreshToken(user);
        String refreshExpiresAt = jwtService.getRefreshExpiresAt();

        AuthResponse resp = AuthResponse.builder()
                .accessToken(newAccess)
                .refreshToken(newRefresh)
                .refreshExpiresAt(refreshExpiresAt)
                .tokenType("Bearer")
                .message("Token refreshed")
                .user(user)
                .build();

        return ResponseEntity.ok(resp);
    }

    // ---------------------------------------------------------
    // LOGOUT
    // ---------------------------------------------------------
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody LogoutRequest request) {
        refreshTokenService.deleteByToken(request.getRefreshToken());
        return ResponseEntity.ok().build();
    }

    // ---------------------------------------------------------
    // ME (CURRENT USER)
    // ---------------------------------------------------------
    @GetMapping("/me")
    public ResponseEntity<AuthMeResponse> me(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        if (token == null) {
            return ResponseEntity.status(401).build();
        }

        String phone = jwtService.extractPhoneNumber(token);
        User user = authService.findByPhoneNumber(phone);

        AuthMeResponse resp = new AuthMeResponse(
                user.getUsername(),
                user.getRole().name(),
                user.getPhoneNumber()
        );

        return ResponseEntity.ok(resp);
    }
}