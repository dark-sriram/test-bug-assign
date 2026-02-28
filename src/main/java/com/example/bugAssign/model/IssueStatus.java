package com.example.bugAssign.model;

import java.util.EnumMap;
import java.util.Map;
import java.util.Set;

public enum IssueStatus {
    OPEN("Can be assigned to developer"),
    IN_PROGRESS("Developer is working on issue"),
    PENDING_VERIFICATION("Waiting for tester verification"),
    RESOLVED("Issue fixed and verified"),
    REOPENED("Issue reopened after resolution"),
    CLOSED("Issue is closed");

    private final String description;
    private static final Map<IssueStatus, Set<IssueStatus>> TRANSITIONS = new EnumMap<>(IssueStatus.class);

    IssueStatus(String description) {
        this.description = description;
    }

    // Static initializer block - runs AFTER all enum constants are created
    static {
        TRANSITIONS.put(OPEN, Set.of(IN_PROGRESS));
        TRANSITIONS.put(IN_PROGRESS, Set.of(PENDING_VERIFICATION));
        TRANSITIONS.put(PENDING_VERIFICATION, Set.of(RESOLVED, IN_PROGRESS));
        TRANSITIONS.put(RESOLVED, Set.of(CLOSED, REOPENED));
        TRANSITIONS.put(REOPENED, Set.of(IN_PROGRESS));
        TRANSITIONS.put(CLOSED, Set.of());
    }

    public boolean canTransitionTo(IssueStatus target) {
        return TRANSITIONS.getOrDefault(this, Set.of()).contains(target);
    }

    public Set<IssueStatus> getAllowedTransitions() {
        return TRANSITIONS.getOrDefault(this, Set.of());
    }

    public String getDescription() {
        return description;
    }

    // Helper method for debugging/validation
    public static void validateTransitions() {
        for (IssueStatus status : values()) {
            System.out.println(status + " → " + TRANSITIONS.getOrDefault(status, Set.of()));
        }
    }
}