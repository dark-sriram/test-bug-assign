package com.example.bugAssign.dto;

import com.example.bugAssign.model.IssueStatus;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IssueFilter {
    private IssueStatus status;
    private Long assignedToId;
    private String createdBy;
}
