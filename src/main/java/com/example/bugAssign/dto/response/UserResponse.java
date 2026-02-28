package com.example.bugAssign.dto.response;

import com.example.bugAssign.model.User;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String role;
    
    public UserResponse(User user) {
        if (user != null) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.role = user.getRole() != null ? user.getRole().name() : null;
        }
    }
}