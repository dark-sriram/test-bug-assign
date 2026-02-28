package com.example.bugAssign.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignIssueRequest {
    
    @NotNull(message = "Developer ID is required")
    private Long developerId;
}