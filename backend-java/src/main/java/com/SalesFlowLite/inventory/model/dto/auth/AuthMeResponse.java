package com.SalesFlowLite.inventory.model.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthMeResponse {
    private String username;
    private String role;
    private String phoneNumber;
}