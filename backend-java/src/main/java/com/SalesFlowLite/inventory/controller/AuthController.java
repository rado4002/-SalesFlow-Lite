package com.SalesFlowLite.inventory.controller;

import com.SalesFlowLite.inventory.model.dto.auth.LoginRequest;
import com.SalesFlowLite.inventory.model.dto.auth.AuthResponse;
import com.SalesFlowLite.inventory.model.dto.auth.RegisterRequest;
import com.SalesFlowLite.inventory.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest loginRequest
    ) {
        AuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest registerRequest
    ) {
        AuthResponse response = authService.register(registerRequest);
        return ResponseEntity.ok(response);
    }
}
