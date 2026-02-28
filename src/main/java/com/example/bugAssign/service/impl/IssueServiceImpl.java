package com.example.bugAssign.service.impl;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.bugAssign.dto.IssueFilter;
import com.example.bugAssign.dto.request.AssignIssueRequest;
import com.example.bugAssign.dto.request.CreateIssueRequest;
import com.example.bugAssign.dto.request.UpdateIssueStatusRequest;
import com.example.bugAssign.exception.ResourceNotFoundException;
import com.example.bugAssign.exception.RolePermissionException;
import com.example.bugAssign.model.Issue;
import com.example.bugAssign.model.IssueStatus;
import com.example.bugAssign.model.Role;
import com.example.bugAssign.model.User;
import com.example.bugAssign.repository.IssueRepository;
import com.example.bugAssign.repository.UserRepository;
import com.example.bugAssign.repository.specification.IssueSpecifications;
import com.example.bugAssign.service.IssueService;
import com.example.bugAssign.service.IssueValidator;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class IssueServiceImpl implements IssueService {
    
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final IssueValidator issueValidator;
    
    @Override
    public Issue createIssue(CreateIssueRequest request, User currentUser) {
        issueValidator.validateUserCanCreateIssue(currentUser);
        
        Issue issue = new Issue();
        issue.setTitle(request.getTitle());
        issue.setDescription(request.getDescription());
        issue.setPriority(request.getPriority());
        issue.setCreatedBy(currentUser);
        issue.setStatus(IssueStatus.OPEN);
        
        return issueRepository.save(issue);
    }
    
    @Override
    public Issue assignIssue(Long issueId, AssignIssueRequest request, User currentUser) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));
        
        issueValidator.validateIssueAssignment(issue, currentUser);
        
        User developer = userRepository.findById(request.getDeveloperId())
                .orElseThrow(() -> new ResourceNotFoundException("Developer not found with id: " + request.getDeveloperId()));
        
        // Fix: Use equals() instead of != for enum comparison
        if (!Role.DEVELOPER.equals(developer.getRole())) {
            throw new RolePermissionException("Assigned user must be a DEVELOPER");
        }
        
        issue.setAssignedTo(developer);
        return issueRepository.save(issue);
    }
    
    @Override
    public Issue updateStatus(Long issueId, UpdateIssueStatusRequest request, User currentUser) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));
        
        IssueStatus newStatus = request.getNewStatus();
        
        // Special handling: REOPENED actually transitions to IN_PROGRESS
        if (IssueStatus.REOPENED.equals(newStatus)) {
            issueValidator.validateStatusTransition(issue, IssueStatus.RESOLVED, currentUser);
            issue.setStatus(IssueStatus.IN_PROGRESS);
            issue.setClosedBy(null); // Clear closedBy when reopened
        } else {
            issueValidator.validateStatusTransition(issue, newStatus, currentUser);
            issue.setStatus(newStatus);
            
            // Special handling for closing
            if (IssueStatus.CLOSED.equals(newStatus)) {
                issue.setClosedBy(currentUser);
            }
        }
        
        return issueRepository.save(issue);
    }
    
    @Override
    public List<Issue> getAllIssues(IssueFilter filter) {
        Specification<Issue> spec = Specification.where((Specification<Issue>) null);
        
        if (filter.getStatus() != null) {
            spec = spec.and(IssueSpecifications.filterByStatus(filter.getStatus()));
        }
        if (filter.getAssignedToId() != null) {
            spec = spec.and(IssueSpecifications.filterByAssignedUser(filter.getAssignedToId()));
        }
        if (filter.getCreatedBy() != null && !filter.getCreatedBy().isEmpty()) {
            spec = spec.and(IssueSpecifications.filterByCreatedBy(filter.getCreatedBy()));
        }
        
        return issueRepository.findAll(spec);
    }
    
    @Override
    public Issue getIssueById(Long issueId) {
        return issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));
    }
}