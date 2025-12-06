// src/main/java/com/SalesFlowLite/inventory/service/UserService.java
package com.SalesFlowLite.inventory.service;

import com.SalesFlowLite.inventory.model.dto.user.ChangePasswordRequest;
import com.SalesFlowLite.inventory.model.dto.user.UpdateUserRequest;
import com.SalesFlowLite.inventory.model.dto.user.UserResponse;
import com.SalesFlowLite.inventory.model.entity.User;
import com.SalesFlowLite.inventory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ================================
    // /me
    // ================================
    public UserResponse getCurrentUser(String phoneNumber) {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserResponse.builder()
                .id(user.getId().toString())           // <-- CONVERT Long → String
                .phoneNumber(user.getPhoneNumber())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    // ================================
    // UPDATE USER
    // ================================
    public UserResponse updateUser(String phoneNumber, UpdateUserRequest request) {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        userRepository.save(user);

        return UserResponse.builder()
                .id(user.getId().toString())           // <-- CONVERT Long → String
                .phoneNumber(user.getPhoneNumber())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    // ================================
    // CHANGE PASSWORD
    // ================================
    public void changePassword(String phoneNumber, ChangePasswordRequest request) {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}