# API Integration Test Plan

## Scope
This document defines proposed contract-level and endpoint-level test cases for the shared public API contract for Tech Smart Learning for Seniors.

The contract remains Draft - Pending UI, Sponsor, and Backend Team Confirmation.

---

## Contract-Level Tests

### Test 1: Valid Assistance Request Submission
- Test scenario: valid assistance request payload
- Input/request:
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
- Expected HTTP status: 201 Created
- Expected behavior: request is accepted and returns a success payload with requestId and status received

### Test 2: Missing First Name
- Test scenario: assistance request missing firstName
- Input/request:
```json
{
  "lastName": "Johnson",
  "email": "mary@example.com",
  "helpCategory": "smartphone",
  "description": "I need help learning how to make a video call."
}
```
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies firstName as required

### Test 3: Missing Last Name
- Test scenario: assistance request missing lastName
- Input/request:
```json
{
  "firstName": "Mary",
  "email": "mary@example.com",
  "helpCategory": "smartphone",
  "description": "I need help learning how to make a video call."
}
```
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies lastName as required

### Test 4: Missing Both Email and Phone
- Test scenario: assistance request without any contact method
- Input/request:
```json
{
  "firstName": "Mary",
  "lastName": "Johnson",
  "helpCategory": "smartphone",
  "description": "I need help learning how to make a video call."
}
```
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error indicates at least one contact method is required

### Test 5: Malformed Email
- Test scenario: invalid email in assistance request
- Input/request:
```json
{
  "firstName": "Mary",
  "lastName": "Johnson",
  "email": "not-an-email",
  "helpCategory": "smartphone",
  "description": "I need help learning how to make a video call."
}
```
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies email as invalid

### Test 6: Empty Description
- Test scenario: empty description in assistance request
- Input/request:
```json
{
  "firstName": "Mary",
  "lastName": "Johnson",
  "email": "mary@example.com",
  "helpCategory": "smartphone",
  "description": ""
}
```
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error indicates description cannot be empty

### Test 7: Unsupported Help Category
- Test scenario: non-approved helpCategory value
- Input/request:
```json
{
  "firstName": "Mary",
  "lastName": "Johnson",
  "email": "mary@example.com",
  "helpCategory": "unsupported-category",
  "description": "I need help learning how to make a video call."
}
```
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies helpCategory as unsupported

### Test 8: Assistance Request Simulated Server Error
- Test scenario: backend failure while processing valid assistance request
- Input/request: valid assistance request payload while mock backend is configured to fail
- Expected HTTP status: 500 Internal Server Error
- Expected behavior: generic server error response without stack traces or sensitive details

### Test 9: Valid Volunteer Inquiry Submission
- Test scenario: valid volunteer inquiry payload
- Input/request:
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
- Expected HTTP status: 201 Created
- Expected behavior: inquiry is accepted and response includes inquiryId and status received

### Test 10: Volunteer Inquiry Missing Email
- Test scenario: missing required email
- Input/request:
```json
{
  "firstName": "David",
  "lastName": "Lee",
  "volunteerInterest": "technology-help"
}
```
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies email as required

### Test 11: Volunteer Inquiry Malformed Email
- Test scenario: invalid email format
- Input/request:
```json
{
  "firstName": "David",
  "lastName": "Lee",
  "email": "bad-email",
  "volunteerInterest": "technology-help"
}
```
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies email as invalid

### Test 12: Volunteer Inquiry Missing Interest
- Test scenario: missing volunteerInterest
- Input/request:
```json
{
  "firstName": "David",
  "lastName": "Lee",
  "email": "david@example.com"
}
```
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies volunteerInterest as required

### Test 13: Volunteer Inquiry Simulated Server Error
- Test scenario: backend error during volunteer inquiry submission
- Input/request: valid volunteer inquiry payload while server is simulated to fail
- Expected HTTP status: 500 Internal Server Error
- Expected behavior: generic server error message is returned without exposing internal implementation details

### Test 14: Valid General Contact Inquiry Submission
- Test scenario: valid contact inquiry submission
- Input/request:
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
- Expected HTTP status: 201 Created
- Expected behavior: inquiry is accepted and returns success payload

### Test 15: General Contact Missing Required Field
- Test scenario: missing inquiryType
- Input/request:
```json
{
  "firstName": "Alicia",
  "lastName": "Martin",
  "email": "alicia@example.com"
}
```
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies inquiryType as required

### Test 16: General Contact Malformed Email
- Test scenario: invalid email format
- Input/request:
```json
{
  "firstName": "Alicia",
  "lastName": "Martin",
  "email": "invalid-email",
  "inquiryType": "partnership"
}
```
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies email as invalid

### Test 17: General Contact Simulated Server Error
- Test scenario: backend error during general contact submission
- Input/request: valid contact inquiry payload while server is simulated to fail
- Expected HTTP status: 500 Internal Server Error
- Expected behavior: generic server error message is returned without exposing internals

---

## Contract Diagnostics Tests

### Test 18: Invalid JSON Content-Type
- Test scenario: request sent with text/plain or other non-JSON content type
- Input/request: POST to any endpoint with invalid Content-Type
- Expected HTTP status: 415 Unsupported Media Type
- Expected behavior: API rejects the request and returns a standardized error payload

### Test 19: Unsupported HTTP Method
- Test scenario: GET or PUT request to a POST-only endpoint
- Input/request: GET /api/v1/assistance-requests
- Expected HTTP status: 405 Method Not Allowed
- Expected behavior: API returns standard method-not-allowed error response

### Test 20: Unknown Endpoint
- Test scenario: request to undefined path
- Input/request: GET /api/v1/does-not-exist
- Expected HTTP status: 404 Not Found
- Expected behavior: API responds with a standard not-found error payload

### Test 21: Consistent Error Schema
- Test scenario: validation fail on any endpoint
- Input/request: missing or malformed required field on any endpoint
- Expected HTTP status: 400 Bad Request
- Expected behavior: response body includes top-level error object with code, message, and fields when applicable

---

## Notes
- All tests should be executed against the mock API layer until real backend Team #30 delivery is available.
- The contract remains draft and must be finalized with sponsor and backend approval before production use.
- Error handling should be consistent across all endpoints to support frontend form behavior and API contract verification.
