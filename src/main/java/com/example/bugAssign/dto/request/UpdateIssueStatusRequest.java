package com.example.bugAssign.dto.request;

import com.example.bugAssign.model.IssueStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateIssueStatusRequest {
    
    @NotNull(message = "New status is required")
    private IssueStatus newStatus;
}
