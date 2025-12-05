package com.SalesFlowLite.inventory.model.dto.user;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserResponse {
    private String id;
    private String phoneNumber;
    private String username;
    private String email;
    private String role;
}
