# API Integration Test Plan

## Scope
This document defines contract-level and endpoint-level test cases for the shared public API contract for Tech Smart Learning for Seniors.

The workflows (Technology Help Request, Volunteer Signup, General Contact, Donor Interest/Inquiry) are Sponsor-Confirmed (REQ-21 through REQ-29). Volunteer Signup fields are Figma-Confirmed (REQ-22). Donor Interest/Inquiry fields beyond the documented baseline remain Pending Frontend Field Confirmation. Final response/error schema details remain Pending Backend Team #30 Confirmation.

---

## Contract-Level Tests

### Test 1: Valid Assistance Request Submission (REQ-21)
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

### Test 2: Missing First Name (REQ-21)
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

### Test 3: Missing Last Name (REQ-21)
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

### Test 4: Missing Both Email and Phone (REQ-21)
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

### Test 5: Malformed Email (REQ-21)
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

### Test 6: Empty Description (REQ-21)
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

### Test 7: Unsupported Help Category (REQ-21)
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

### Test 8: Assistance Request Simulated Server Error (REQ-21)
- Test scenario: backend failure while processing valid assistance request
- Input/request: valid assistance request payload while mock backend is configured to fail
- Expected HTTP status: 500 Internal Server Error
- Expected behavior: generic server error response without stack traces or sensitive details

### Test 9: Valid Volunteer Inquiry Submission (REQ-22)
- Test scenario: valid volunteer inquiry payload
- Input/request:
```json
{
  "firstName": "David",
  "lastName": "Lee",
  "email": "david@example.com",
  "phone": "4045550135",
  "organizationName": "Local Senior Center",
  "reasonForVolunteering": "Classroom volunteer",
  "leadSource": "Word of mouth",
  "message": "I would like to help seniors learn how to use smartphones."
}
```
- Expected HTTP status: 201 Created
- Expected behavior: inquiry is accepted and response includes inquiryId and status received

### Test 10: Volunteer Inquiry Missing Email (REQ-22)
- Test scenario: missing required email
- Input/request:
```json
{
  "firstName": "David",
  "lastName": "Lee",
  "reasonForVolunteering": "Classroom volunteer"
}
```
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies email as required

### Test 11: Volunteer Inquiry Malformed Email (REQ-22)
- Test scenario: invalid email format
- Input/request:
```json
{
  "firstName": "David",
  "lastName": "Lee",
  "email": "bad-email",
  "reasonForVolunteering": "Classroom volunteer"
}
```
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies email as invalid

### Test 12: Volunteer Inquiry Missing Reason For Volunteering (REQ-22)
- Test scenario: missing reasonForVolunteering
- Input/request:
```json
{
  "firstName": "David",
  "lastName": "Lee",
  "email": "david@example.com"
}
```
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies reasonForVolunteering as required

### Test 13: Volunteer Inquiry Simulated Server Error (REQ-22)
- Test scenario: backend error during volunteer inquiry submission
- Input/request: valid volunteer inquiry payload while server is simulated to fail
- Expected HTTP status: 500 Internal Server Error
- Expected behavior: generic server error message is returned without exposing internal implementation details

### Test 14: Valid General Contact Inquiry Submission (REQ-23)
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

### Test 15: General Contact Missing Required Field (REQ-23)
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

### Test 16: General Contact Malformed Email (REQ-23)
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

### Test 17: General Contact Simulated Server Error (REQ-23)
- Test scenario: backend error during general contact submission
- Input/request: valid contact inquiry payload while server is simulated to fail
- Expected HTTP status: 500 Internal Server Error
- Expected behavior: generic server error message is returned without exposing internals

---

## Contract Diagnostics Tests

### Test 18: Invalid JSON Content-Type (REQ-26)
- Test scenario: request sent with text/plain or other non-JSON content type
- Input/request: POST to any endpoint with invalid Content-Type
- Expected HTTP status: 415 Unsupported Media Type
- Expected behavior: API rejects the request and returns a standardized error payload

### Test 19: Unsupported HTTP Method (REQ-26)
- Test scenario: GET or PUT request to a POST-only endpoint
- Input/request: GET /api/v1/assistance-requests
- Expected HTTP status: 405 Method Not Allowed
- Expected behavior: API returns standard method-not-allowed error response

### Test 20: Unknown Endpoint (REQ-26)
- Test scenario: request to undefined path
- Input/request: GET /api/v1/does-not-exist
- Expected HTTP status: 404 Not Found
- Expected behavior: API responds with a standard not-found error payload

### Test 21: Consistent Error Schema (REQ-26)
- Test scenario: validation fail on any endpoint
- Input/request: missing or malformed required field on any endpoint
- Expected HTTP status: 400 Bad Request
- Expected behavior: response body includes top-level error object with code, message, and fields when applicable

---

## Donor Interest/Inquiry Tests (REQ-24)

### Test 22: Valid Donor Interest/Inquiry Submission (REQ-24)
- Test scenario: valid donor interest/inquiry payload
- Input/request:
```json
{
  "firstName": "Susan",
  "lastName": "Carter",
  "email": "susan@example.com",
  "phone": null,
  "message": "I'd like to learn more about supporting your programs."
}
```
- Expected HTTP status: 201 Created
- Expected behavior: inquiry is accepted and returns a success payload with inquiryId and status received

### Test 23: Donor Inquiry Missing First Name (REQ-24)
- Test scenario: donor inquiry missing firstName
- Input/request:
```json
{
  "lastName": "Carter",
  "email": "susan@example.com",
  "message": "I'd like to learn more about supporting your programs."
}
```
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies firstName as required

### Test 24: Donor Inquiry Missing Both Email and Phone (REQ-24)
- Test scenario: donor inquiry without any contact method
- Input/request:
```json
{
  "firstName": "Susan",
  "lastName": "Carter",
  "message": "I'd like to learn more about supporting your programs."
}
```
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error indicates at least one contact method is required

### Test 25: Donor Inquiry Malformed Email (REQ-24)
- Test scenario: invalid email in donor inquiry
- Input/request:
```json
{
  "firstName": "Susan",
  "lastName": "Carter",
  "email": "not-an-email",
  "message": "I'd like to learn more about supporting your programs."
}
```
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies email as invalid

### Test 26: Donor Inquiry Simulated Server Error (REQ-24)
- Test scenario: backend failure while processing valid donor inquiry
- Input/request: valid donor inquiry payload while mock backend is configured to fail
- Expected HTTP status: 500 Internal Server Error
- Expected behavior: generic server error response without stack traces or sensitive details

---

## Payment Processing Boundary Tests (REQ-24, REQ-29)

### Test 27: Donor Inquiry Rejects Payment Fields
- Test scenario: donor inquiry payload includes payment/card/amount fields (e.g., cardNumber, donationAmount, billingAddress)
- Input/request:
```json
{
  "firstName": "Susan",
  "lastName": "Carter",
  "email": "susan@example.com",
  "donationAmount": 100,
  "cardNumber": "4111111111111111"
}
```
- Expected HTTP status: 400 Bad Request (or field is silently ignored, per final backend decision — Pending Backend Team #30 Confirmation)
- Expected behavior: no payment is processed; the API/mock must not acknowledge, store, or act on payment-related fields under any circumstance

### Test 28: No Payment Processing Endpoint Exists
- Test scenario: confirm there is no payment-processing route in the contract or mock layer
- Input/request: attempt request to any payment-style endpoint (e.g., POST /api/v1/donations/charge)
- Expected HTTP status: 404 Not Found
- Expected behavior: confirms Phase 1 scope excludes payment processing entirely (REQ-24, REQ-29); no such endpoint is documented or mocked

---

## Volunteer Reason/Lead Source Validation Tests (REQ-22)

### Test 29: Volunteer Inquiry Unsupported Reason For Volunteering (REQ-22)
- Test scenario: reasonForVolunteering value not in the approved dropdown list
- Input/request:
```json
{
  "firstName": "David",
  "lastName": "Lee",
  "email": "david@example.com",
  "reasonForVolunteering": "unsupported-reason"
}
```
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies reasonForVolunteering as unsupported

### Test 30: Volunteer Inquiry Unsupported Lead Source (REQ-22)
- Test scenario: leadSource value not in the approved dropdown list; leadSource remains optional, so this test only validates the enum when a value is supplied
- Input/request:
```json
{
  "firstName": "David",
  "lastName": "Lee",
  "email": "david@example.com",
  "reasonForVolunteering": "Classroom volunteer",
  "leadSource": "unsupported-source"
}
```
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies leadSource as an unsupported value; omitting leadSource entirely must not produce a validation error since it is optional

---

## Notes
- All tests should be executed against the mock API layer until real backend Team #30 delivery is available.
- Workflows are Sponsor-Confirmed (REQ-21 through REQ-29); Volunteer Signup fields are Figma-Confirmed (REQ-22); Donor Interest/Inquiry fields beyond the documented baseline remain Pending Frontend Field Confirmation; final error schema details remain Pending Backend Team #30 Confirmation.
- Error handling should be consistent across all endpoints to support frontend form behavior and API contract verification.
