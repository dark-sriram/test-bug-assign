package com.example.bugAssign.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.bugAssign.dto.IssueFilter;
import com.example.bugAssign.dto.request.AssignIssueRequest;
import com.example.bugAssign.dto.request.CreateIssueRequest;
import com.example.bugAssign.dto.request.UpdateIssueStatusRequest;
import com.example.bugAssign.dto.response.IssueResponse;
import com.example.bugAssign.dto.response.PagedResponse;
import com.example.bugAssign.model.Issue;
import com.example.bugAssign.model.IssueStatus;
import com.example.bugAssign.model.User;
import com.example.bugAssign.service.IssueService;
import com.example.bugAssign.service.impl.UserContext;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/issues")
@RequiredArgsConstructor
public class IssueController {
    
    private final IssueService issueService;
    private final UserContext userContext;
    
    @PostMapping
    public ResponseEntity<IssueResponse> createIssue(@Valid @RequestBody CreateIssueRequest request) {
        User currentUser = userContext.getCurrentUser();
        Issue issue = issueService.createIssue(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(new IssueResponse(issue));
    }
    
    @PutMapping("/{id}/assign")
    public ResponseEntity<IssueResponse> assignIssue(
            @PathVariable Long id,
            @Valid @RequestBody AssignIssueRequest request) {
        User currentUser = userContext.getCurrentUser();
        Issue issue = issueService.assignIssue(id, request, currentUser);
        return ResponseEntity.ok(new IssueResponse(issue));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<IssueResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateIssueStatusRequest request) {
        User currentUser = userContext.getCurrentUser();
        Issue issue = issueService.updateStatus(id, request, currentUser);
        return ResponseEntity.ok(new IssueResponse(issue));
    }
    
    @GetMapping("/")
    public ResponseEntity<PagedResponse<IssueResponse>> getAllIssues(
            @RequestParam(required = false) IssueStatus status,
            @RequestParam(required = false) Long assignedToId,
            @RequestParam(required = false) String createdBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        
        IssueFilter filter = new IssueFilter(status, assignedToId, createdBy);
        List<Issue> issues = issueService.getAllIssues(filter);
        
        // Manual pagination since we're using Specifications
        int start = page * size;
        int end = Math.min(start + size, issues.size());
        List<Issue> pageContent = issues.subList(start, end);
        
        List<IssueResponse> responses = pageContent.stream()
                .map(IssueResponse::new)
                .collect(Collectors.toList());
        
        PagedResponse<IssueResponse> pagedResponse = new PagedResponse<>(
                responses,
                page,
                size,
                issues.size(),
                (int) Math.ceil((double) issues.size() / size)
        );
        
        return ResponseEntity.ok(pagedResponse);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<IssueResponse> getIssueById(@PathVariable Long id) {
        Issue issue = issueService.getIssueById(id);
        return ResponseEntity.ok(new IssueResponse(issue));
    }
}
