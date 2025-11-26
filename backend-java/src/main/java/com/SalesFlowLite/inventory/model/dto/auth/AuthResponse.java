package com.SalesFlowLite.inventory.model.dto.auth;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthResponse {

    private String token;

    private String phoneNumber;

    private String username;

    private String role;   // <-- FIXED (STRING)
}
