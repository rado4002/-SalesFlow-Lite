package com.SalesFlowLite.inventory.model.dto.auth;

import com.SalesFlowLite.inventory.model.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String refreshExpiresAt;

    private String tokenType;   // "Bearer"
    private String message;     // success message

    private User user;          // OPTIONAL → for frontend use
}
