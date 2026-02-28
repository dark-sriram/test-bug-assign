package com.example.bugAssign.dto.request;

import com.example.bugAssign.model.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateUserRequest {
    
    @NotBlank(message = "Username is required")
    @Size(max = 255, message = "Username cannot exceed 255 characters")
    private String username;
    
    @NotNull(message = "Role is required")
    private Role role;
}
