package com.example.bugAssign.dto.response;

import com.example.bugAssign.model.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class IssueResponse {
    
    private Long id;
    private String title;
    private String description;
    private IssueStatus status;
    private Priority priority;
    private UserResponse createdBy;
    private UserResponse assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserResponse closedBy;
    
    public IssueResponse(Issue issue) {
        this.id = issue.getId();
        this.title = issue.getTitle();
        this.description = issue.getDescription();
        this.status = issue.getStatus();
        this.priority = issue.getPriority();
        this.createdBy = new UserResponse(issue.getCreatedBy());
        this.assignedTo = new UserResponse(issue.getAssignedTo());
        this.createdAt = issue.getCreatedAt();
        this.updatedAt = issue.getUpdatedAt();
        this.closedBy = new UserResponse(issue.getClosedBy());
    }
}
