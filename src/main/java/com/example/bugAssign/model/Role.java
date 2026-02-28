package com.example.bugAssign.model;

public enum Role {
    ADMIN("Can manage all issues and users"),
    DEVELOPER("Can work on assigned issues"),
    TESTER("Can verify and close issues");
    
    private final String description;
    
    Role(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
