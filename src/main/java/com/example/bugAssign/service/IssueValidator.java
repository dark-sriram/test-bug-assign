package com.example.bugAssign.service;

import org.springframework.stereotype.Component;

import com.example.bugAssign.exception.InvalidStatusTransitionException;
import com.example.bugAssign.exception.RolePermissionException;
import com.example.bugAssign.model.Issue;
import com.example.bugAssign.model.IssueStatus;
import com.example.bugAssign.model.Role;
import com.example.bugAssign.model.User;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class IssueValidator {
    
    public void validateUserCanCreateIssue(User currentUser) {
        if (!Role.ADMIN.equals(currentUser.getRole()) && 
            !Role.TESTER.equals(currentUser.getRole())) {
            throw new RolePermissionException("Only ADMIN or TESTER can create issues");
        }
    }
    
    public void validateIssueAssignment(Issue issue, User currentUser) {
        if (!IssueStatus.OPEN.equals(issue.getStatus())) {
            throw new InvalidStatusTransitionException(
                "Issue must be in OPEN status to be assigned. Current status: " + issue.getStatus());
        }
        
        if (!Role.ADMIN.equals(currentUser.getRole())) {
            throw new RolePermissionException("Only ADMIN can assign issues");
        }
    }
    
    public void validateStatusTransition(Issue issue, IssueStatus newStatus, User currentUser) {
        // 1. Check if transition is allowed by lifecycle
        if (!issue.getStatus().canTransitionTo(newStatus)) {
            throw new InvalidStatusTransitionException(
                String.format("Invalid transition from %s to %s. Allowed transitions: %s", 
                    issue.getStatus(), 
                    newStatus,
                    issue.getStatus().getAllowedTransitions())); // ✅ FIXED: Use method instead of field
        }
        
        // 2. Check if user has permission for this transition
        switch (newStatus) {
            case IN_PROGRESS -> {
                if (issue.getAssignedTo() == null) {
                    throw new InvalidStatusTransitionException(
                        "Issue must be assigned to a developer before moving to IN_PROGRESS");
                }
                if (!issue.getAssignedTo().getId().equals(currentUser.getId())) {
                    throw new RolePermissionException(
                        "Only the assigned DEVELOPER can move issue to IN_PROGRESS");
                }
            }
                
            case PENDING_VERIFICATION -> {
                if (issue.getAssignedTo() == null || !issue.getAssignedTo().getId().equals(currentUser.getId())) {
                    throw new RolePermissionException(
                        "Only the assigned DEVELOPER can submit issue for verification");
                }
            }
                
            case RESOLVED -> {
                if (!Role.TESTER.equals(currentUser.getRole()) && 
                    !Role.ADMIN.equals(currentUser.getRole())) {
                    throw new RolePermissionException(
                        "Only TESTER or ADMIN can verify and resolve issues");
                }
            }
                
            case CLOSED -> {
                if (!IssueStatus.RESOLVED.equals(issue.getStatus())) {
                    throw new InvalidStatusTransitionException(
                        "Only RESOLVED issues can be closed. Current status: " + issue.getStatus());
                }
                if (!Role.ADMIN.equals(currentUser.getRole()) && 
                    !Role.TESTER.equals(currentUser.getRole())) {
                    throw new RolePermissionException(
                        "Only ADMIN or TESTER can close issues");
                }
            }
                
            case REOPENED -> {
                if (!IssueStatus.RESOLVED.equals(issue.getStatus())) {
                    throw new InvalidStatusTransitionException(
                        "Only RESOLVED issues can be reopened. Current status: " + issue.getStatus());
                }
                if (!Role.TESTER.equals(currentUser.getRole()) && 
                    !Role.ADMIN.equals(currentUser.getRole())) {
                    throw new RolePermissionException(
                        "Only TESTER or ADMIN can reopen issues");
                }
            }
                
            case OPEN -> {
                // Only ADMIN can reset status to OPEN (e.g., for reassignment)
                if (!Role.ADMIN.equals(currentUser.getRole())) {
                    throw new RolePermissionException("Only ADMIN can reset issues to OPEN status");
                }
            }
                
            default -> throw new InvalidStatusTransitionException("Unknown status transition: " + newStatus);
        }
    }
}