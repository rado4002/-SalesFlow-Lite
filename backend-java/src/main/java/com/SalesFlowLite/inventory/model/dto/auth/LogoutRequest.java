package com.SalesFlowLite.inventory.model.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LogoutRequest {
    private String refreshToken;
}
