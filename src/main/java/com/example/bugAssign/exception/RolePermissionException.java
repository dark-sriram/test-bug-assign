package com.example.bugAssign.exception;

public class RolePermissionException extends RuntimeException {
    public RolePermissionException(String message) {
        super(message);
    }
}
