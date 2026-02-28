package com.example.bugAssign.service;

import com.example.bugAssign.dto.IssueFilter;
import com.example.bugAssign.dto.request.*;
import com.example.bugAssign.model.Issue;
import com.example.bugAssign.model.User;

import java.util.List;

public interface IssueService {
    Issue createIssue(CreateIssueRequest request, User currentUser);
    Issue assignIssue(Long issueId, AssignIssueRequest request, User currentUser);
    Issue updateStatus(Long issueId, UpdateIssueStatusRequest request, User currentUser);
    List<Issue> getAllIssues(IssueFilter filter);
    Issue getIssueById(Long issueId);
}
