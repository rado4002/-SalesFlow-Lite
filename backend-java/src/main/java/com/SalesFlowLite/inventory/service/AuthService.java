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
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     * LOGIN
     */
    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getPhoneNumber(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        String token = jwtService.generateToken(
                user.getPhoneNumber(),
                user.getRole().name(),
                user.getUsername()
        );

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .build();
    }

    /**
     * REGISTER
     */
    public AuthResponse register(RegisterRequest request) {

        Role userRole = Role.valueOf(request.getRole().toUpperCase());

        User user = User.builder()
                .username(request.getUsername())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(
                user.getPhoneNumber(),
                user.getRole().name(),
                user.getUsername()
        );

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .build();
    }
}