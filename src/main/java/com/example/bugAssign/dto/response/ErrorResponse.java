package com.example.bugAssign.dto.response;

import lombok.Data;
import java.time.Instant;

@Data
public class ErrorResponse {
    
    private int status;
    private String error;
    private String message;
    private Instant timestamp;
    
    public ErrorResponse(int status, String error, String message, Instant timestamp) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.timestamp = timestamp;
    }
}
