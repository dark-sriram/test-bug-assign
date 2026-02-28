package com.example.bugAssign.service;

import com.example.bugAssign.dto.request.CreateUserRequest;
import com.example.bugAssign.model.User;

import java.util.List;

public interface UserService {
    User getCurrentUser();
    User getUserById(Long userId);
    List<User> getAllUsers();
    User createUser(CreateUserRequest request);
}