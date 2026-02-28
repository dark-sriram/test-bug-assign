package com.example.bugAssign;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test") // ← MUST HAVE THIS!
class BugAssignApplicationTests {

    @Test
    void contextLoads() {
        // If this passes, Spring context loads successfully
    }
}
