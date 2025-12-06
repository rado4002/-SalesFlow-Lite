package com.SalesFlowLite.inventory.controller;

import com.SalesFlowLite.inventory.model.dto.user.ChangePasswordRequest;
import com.SalesFlowLite.inventory.model.dto.user.UpdateUserRequest;
import com.SalesFlowLite.inventory.model.dto.user.UserResponse;
import com.SalesFlowLite.inventory.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ================================
    // GET /me
    // ================================
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(Authentication authentication) {

        String phoneNumber = authentication.getName(); // sub = phoneNumber in your JWT

        return ResponseEntity.ok(userService.getCurrentUser(phoneNumber));
    }

    // ================================
    // UPDATE PROFILE
    // ================================
    @PutMapping("/update")
    public ResponseEntity<UserResponse> updateUser(
            Authentication authentication,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        String phoneNumber = authentication.getName();
        return ResponseEntity.ok(userService.updateUser(phoneNumber, request));
    }

    // ================================
    // CHANGE PASSWORD
    // ================================
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        String phoneNumber = authentication.getName();
        userService.changePassword(phoneNumber, request);
        return ResponseEntity.ok("Password changed successfully");
    }
}
