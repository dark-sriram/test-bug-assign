# Bug / Issue Tracking System

A full-stack bug tracking application for the KIOT 2026 hackathon. Backend: Java Spring Boot. Frontend: React + Vite.

## Features

- **User Management**: Create users with roles (ADMIN, DEVELOPER, TESTER), list all users
- **Issue Management**: Create, assign, update status, filter by status/assigned/created-by
- **Issue Lifecycle**: OPEN → IN_PROGRESS → PENDING_VERIFICATION → RESOLVED → CLOSED (with REOPENED)
- **Role-based Rules**: Only TESTER/ADMIN create issues; only assigned DEVELOPER can move OPEN→IN_PROGRESS; only ADMIN/TESTER can close RESOLVED

## Running the Application

### Backend (Spring Boot)

```bash
cd d:\bugAssign
./mvnw spring-boot:run
```

The API runs at `http://localhost:8080/api`

### Frontend (React)

```bash
cd d:\bugAssign\frontend
npm install
npm run dev
```

The UI runs at `http://localhost:5173` and proxies API requests to the backend.

### Quick Start

1. Start the backend first
2. Start the frontend
3. Open http://localhost:5173
4. Select a user (e.g. `admin`, `tester_john`, `dev_sarah`) to log in
5. Create issues, assign to developers, update status

## Seed Data

On first run, the H2 database is populated with:
- Users: admin, tester_john, dev_sarah, dev_mike, tester_lisa
- Sample issues in various statuses

## API Documentation

Swagger UI: http://localhost:8080/api/swagger-ui.html
