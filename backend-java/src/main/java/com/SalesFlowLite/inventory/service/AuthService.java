// src/main/java/com/SalesFlowLite/inventory/service/AuthService.java
package com.SalesFlowLite.inventory.service;

import com.SalesFlowLite.inventory.model.entity.User;
import com.SalesFlowLite.inventory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ================================
    // VALIDATE LOGIN CREDENTIALS
    // ================================
    public User validateCredentials(String phoneNumber, String rawPassword) {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("Invalid phone number or password"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Invalid phone number or password");
        }
        return user;
    }

    // ================================
    // CHECK IF PHONE EXISTS
    // ================================
    public boolean existsByPhoneNumber(String phoneNumber) {
        return userRepository.existsByPhoneNumber(phoneNumber);
    }

    // ================================
    // ENCODE PASSWORD
    // ================================
    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    // ================================
    // SAVE USER (REGISTER)
    // ================================
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // ================================
    // FIND USER SAFELY
    // ================================
    public User findByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User findByPhoneNumberOrNull(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber).orElse(null);
    }
}