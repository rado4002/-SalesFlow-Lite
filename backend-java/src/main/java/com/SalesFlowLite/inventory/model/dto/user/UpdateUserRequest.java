package com.SalesFlowLite.inventory.model.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "Invalid email format")
    private String email;
}
