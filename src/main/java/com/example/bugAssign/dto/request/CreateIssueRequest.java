package com.example.bugAssign.dto.request;

import com.example.bugAssign.model.Priority;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateIssueRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(min = 10, message = "Description must be at least 10 characters")
    private String description;
    
    @NotNull(message = "Priority is required")
    private Priority priority;
}
