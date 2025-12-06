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
public class TokenRefreshResponse {

    private String accessToken;
    private String refreshToken;

    private User user; // 🔥 Added → fixes .user(user) error
}
