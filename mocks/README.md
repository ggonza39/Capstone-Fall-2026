# Mock API Layer

## Purpose
This mock API layer exists so the Tech Smart Learning for Seniors website team can continue frontend development without waiting for backend Team #30 to complete the live API.

This layer is intentionally limited to frontend enablement and contract verification. It does not create a database, does not claim to be a production backend, and does not implement production business logic.

## Current Status
- No mocking framework is required for this draft stage.
- The current design is a lightweight documentation-driven mock layer until a project-approved tool is adopted.
- The mock endpoints follow the same shared API contract used by the public-facing website integration.

## Mock API Strategy

```text
Next.js Frontend
        |
        | HTTP + JSON
        v
Mock API
        |
        | follows shared API contract
        v
Simulated Response
```

Later:

```text
Next.js Frontend
        |
        | SAME contract
        v
Team #30 Real Backend API
```

The mock layer supports:
- frontend development;
- form integration;
- success-state testing;
- validation-error testing;
- failure-state testing;
- API contract verification.

## Planned Mock Endpoints
1. POST /api/v1/assistance-requests
2. POST /api/v1/volunteer-inquiries
3. POST /api/v1/contact-inquiries

---

## Endpoint 1: POST /api/v1/assistance-requests

### Purpose
Allow the frontend to simulate a visitor submitting a technology assistance request.

### Expected Request
```json
{
  "firstName": "Mary",
  "lastName": "Johnson",
  "email": "mary@example.com",
  "phone": "4045550100",
  "preferredContactMethod": "phone",
  "helpCategory": "smartphone",
  "description": "I need help learning how to make a video call.",
  "accessibilityNeeds": null
}
```

### Simulated 201 Success Response
```json
{
  "requestId": "TS-1001",
  "status": "received",
  "message": "Your assistance request has been received."
}
```

### Simulated 400 Validation Failure
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid or missing information.",
    "fields": {
      "description": "Description is required.",
      "email": "Enter a valid email address."
    }
  }
}
```

### Simulated 500 Server Failure
```json
{
  "error": {
    "code": "SERVER_ERROR",
    "message": "The request could not be processed at this time."
  }
}
```

### HTTP Status Codes
- 201 Created for valid request acceptance
- 400 Bad Request for missing or invalid fields
- 500 Internal Server Error for mock server failure simulation

---

## Endpoint 2: POST /api/v1/volunteer-inquiries

### Purpose
Allow the frontend to simulate a volunteer inquiry.

### Expected Request
```json
{
  "firstName": "David",
  "lastName": "Lee",
  "email": "david@example.com",
  "phone": "4045550135",
  "volunteerInterest": "technology-help",
  "message": "I would like to help seniors learn how to use smartphones."
}
```

### Simulated 201 Success Response
```json
{
  "inquiryId": "VI-1001",
  "status": "received",
  "message": "Your volunteer inquiry has been received."
}
```

### Simulated 400 Validation Failure
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid or missing information.",
    "fields": {
      "email": "Enter a valid email address.",
      "volunteerInterest": "Volunteer interest is required."
    }
  }
}
```

### Simulated 500 Server Failure
```json
{
  "error": {
    "code": "SERVER_ERROR",
    "message": "The request could not be processed at this time."
  }
}
```

### HTTP Status Codes
- 201 Created for valid request acceptance
- 400 Bad Request for missing or invalid fields
- 500 Internal Server Error for mock server failure simulation

---

## Endpoint 3: POST /api/v1/contact-inquiries

### Purpose
Allow the frontend to simulate a general contact inquiry that does not belong to the assistance or volunteer workflow.

### Expected Request
```json
{
  "firstName": "Alicia",
  "lastName": "Martin",
  "email": "alicia@example.com",
  "phone": "4045550172",
  "inquiryType": "partnership",
  "organization": "Community Center",
  "message": "We would like to learn more about partnership opportunities."
}
```

### Simulated 201 Success Response
```json
{
  "inquiryId": "CI-1001",
  "status": "received",
  "message": "Your contact inquiry has been received."
}
```

### Simulated 400 Validation Failure
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid or missing information.",
    "fields": {
      "inquiryType": "Please select a valid inquiry type.",
      "email": "Enter a valid email address."
    }
  }
}
```

### Simulated 500 Server Failure
```json
{
  "error": {
    "code": "SERVER_ERROR",
    "message": "The request could not be processed at this time."
  }
}
```

### HTTP Status Codes
- 201 Created for valid request acceptance
- 400 Bad Request for missing or invalid fields
- 500 Internal Server Error for mock server failure simulation

---

## Mock Scope Boundaries
The mock API layer is for:
- frontend development;
- form integration;
- success-state testing;
- validation-error testing;
- failure-state testing;
- API contract verification.

The mock API layer does not implement:
- a database;
- production business logic;
- duplicate detection;
- CRM processing;
- persistent contact storage.

The mock API must not be treated as a production backend.

