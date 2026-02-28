package com.example.bugAssign.service.impl;

import com.example.bugAssign.model.User;
import com.example.bugAssign.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserContext {
    
    private final UserService userService;
    
    public User getCurrentUser() {
        return userService.getCurrentUser();
    }
}