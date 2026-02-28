package com.example.bugAssign.repository.specification;

import com.example.bugAssign.model.Issue;
import com.example.bugAssign.model.IssueStatus;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

public class IssueSpecifications {
    
    public static Specification<Issue> filterByStatus(IssueStatus status) {
        return (root, query, cb) -> status == null ? cb.conjunction() : cb.equal(root.get("status"), status);
    }
    
    public static Specification<Issue> filterByAssignedUser(Long assignedToId) {
        return (root, query, cb) -> {
            if (assignedToId == null) return cb.conjunction();
            Join<Issue, com.example.bugAssign.model.User> assignedToJoin = root.join("assignedTo", JoinType.LEFT);
            return cb.equal(assignedToJoin.get("id"), assignedToId);
        };
    }
    
    public static Specification<Issue> filterByCreatedBy(String createdBy) {
        return (root, query, cb) -> {
            if (createdBy == null || createdBy.isEmpty()) return cb.conjunction();
            Join<Issue, com.example.bugAssign.model.User> createdByJoin = root.join("createdBy", JoinType.INNER);
            return cb.equal(cb.lower(createdByJoin.get("username")), createdBy.toLowerCase());
        };
    }
}
