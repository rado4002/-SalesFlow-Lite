// src/main/java/com/SalesFlowLite/inventory/model/dto/auth/RegisterRequest.java
package com.SalesFlowLite.inventory.model.dto.auth;

import com.SalesFlowLite.inventory.model.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank private String username;
    @NotBlank private String phoneNumber;
    @Email @NotBlank private String email;
    @NotBlank private String password;
    private Role role = Role.USER; // default
}