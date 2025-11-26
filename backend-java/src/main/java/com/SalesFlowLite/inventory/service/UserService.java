package com.SalesFlowLite.inventory.service;

import com.SalesFlowLite.inventory.model.dto.auth.AuthResponse;
import com.SalesFlowLite.inventory.model.dto.auth.LoginRequest;
import com.SalesFlowLite.inventory.model.dto.auth.RegisterRequest;
import com.SalesFlowLite.inventory.model.entity.Role;
import com.SalesFlowLite.inventory.model.entity.User;
import com.SalesFlowLite.inventory.repository.UserRepository;
import com.SalesFlowLite.inventory.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    // ----------------------------
    // REGISTER USER
    // ----------------------------
    public AuthResponse registerUser(RegisterRequest request) {

        if (userRepository.findByPhoneNumber(request.getPhoneNumber()).isPresent()) {
            throw new RuntimeException("User already exists with this phone number.");
        }

        User user = User.builder()
                .phoneNumber(request.getPhoneNumber())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(
                user.getPhoneNumber(),
                user.getRole().name(),
                user.getUsername()
        );

        return AuthResponse.builder()
                .token(token)
                .phoneNumber(user.getPhoneNumber())
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();
    }

    // ----------------------------
    // LOGIN USER
    // ----------------------------
    public AuthResponse authenticate(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getPhoneNumber(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow(() -> new RuntimeException("Invalid credentials."));

        String token = jwtService.generateToken(
                user.getPhoneNumber(),
                user.getRole().name(),
                user.getUsername()
        );

        return AuthResponse.builder()
                .token(token)
                .phoneNumber(user.getPhoneNumber())
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();
    }

    // ----------------------------
    // USED BY SECURITY
    // ----------------------------
    public User loadUserByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found."));
    }
}