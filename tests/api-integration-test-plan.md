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

---

## Workshop Search, Details & Registration Tests (Milestone-2 — PBI-7 / PBI-8 / PBI-12, SANDBOX ONLY)

These endpoints (`documentation/api-contract.md`, "API 5") are sandbox/mock only and are not part of the REQ-21–REQ-29 shared contract with Team #30. Automated coverage lives in `capstonefall2026/src/mocks/validation-logic/workshopRegistration.test.js`, `capstonefall2026/src/mocks/validation-logic/validationHelpers.test.js` (pure business-logic/validation rules), and `capstonefall2026/src/pages/NeedHelp.test.js` (UI-level loading/empty/success/error/full states).

### Test 31: Valid Workshop Search (PBI-7)
- Test scenario: GET /api/workshops with a valid 5-digit ZIP
- Expected HTTP status: 200 OK
- Expected behavior: returns a `workshops` array of representative sandbox results

### Test 32: Invalid ZIP Code (PBI-7)
- Test scenario: GET /api/workshops with a malformed or missing ZIP
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies `zip` as invalid

### Test 33: No Matching Workshops (PBI-7)
- Test scenario: GET /api/workshops with a valid ZIP and an `eventType` filter that matches no sandbox workshops
- Expected HTTP status: 200 OK
- Expected behavior: returns an empty `workshops` array; frontend shows a user-friendly empty-results message

### Test 34: Workshop Loading State (PBI-7 / PBI-12)
- Test scenario: workshop search request is in flight
- Expected behavior: frontend displays a visible, accessible loading indicator while awaiting the response

### Test 35: Valid Workshop Detail Lookup (PBI-8)
- Test scenario: GET /api/workshops/:id with a known workshop id
- Expected HTTP status: 200 OK
- Expected behavior: returns the full workshop detail record (title, dateTime, location, roomNumber, instructorName, accessibilityFeatures, seatAvailability)

### Test 36: Unknown Workshop Detail (PBI-8)
- Test scenario: GET /api/workshops/:id with an id that does not exist
- Expected HTTP status: 404 Not Found
- Expected behavior: standard error envelope with `code: "NOT_FOUND"`

### Test 37: Valid Sandbox Registration Submission (PBI-8 / PBI-12)
- Test scenario: POST /api/workshops/:id/registrations with a workshop that has available seats and a complete payload
- Expected HTTP status: 201 Created
- Expected behavior: response includes `registrationId`, `status: "received"`, a `message` that clearly identifies the submission as a sandbox demonstration, and a workshop summary

### Test 38: Registration Missing Required Fields (PBI-8 / PBI-12)
- Test scenario: POST /api/workshops/:id/registrations missing firstName/lastName and without an email or phone
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies the missing fields

### Test 39: Registration for Unknown Workshop (PBI-8 / PBI-12)
- Test scenario: POST /api/workshops/:id/registrations where `:id` does not match any sandbox workshop
- Expected HTTP status: 404 Not Found
- Expected behavior: standard error envelope with `code: "NOT_FOUND"`

### Test 40: Registration for a Full/Unavailable Workshop (PBI-8 / PBI-12)
- Test scenario: POST /api/workshops/:id/registrations where the sandbox workshop's `seatAvailability` is 0
- Expected HTTP status: 409 Conflict
- Expected behavior: standard error envelope with `code: "WORKSHOP_FULL"`; frontend clearly communicates the workshop is full

---

## Advocate Interest Inquiry Tests (Milestone-3 — PBI-13, SANDBOX ONLY)

This endpoint (`documentation/api-contract.md`, "API 6") is sandbox/mock only, following the same `/api/v1` contract conventions as the REQ-21–REQ-24 endpoints above. Automated coverage lives in `capstonefall2026/src/mocks/validation-logic/advocateInquiries.test.js` (pure validation rules) and `capstonefall2026/src/pages/Advocate.test.js` (UI-level required-field/success/duplicate-submission/API-error states).

### Test 41: Valid Advocate Interest Submission (PBI-13)
- Test scenario: POST /api/v1/advocate-inquiries with firstName, lastName, email, at least one `interests` value, and a message
- Expected HTTP status: 201 Created
- Expected behavior: response includes `inquiryId`, `status: "received"`, and a message confirming the request was received

### Test 42: Advocate Inquiry Missing Required Fields (PBI-13)
- Test scenario: POST /api/v1/advocate-inquiries missing firstName/lastName/email/message
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies each missing field

### Test 43: Advocate Inquiry Malformed Email (PBI-13)
- Test scenario: POST /api/v1/advocate-inquiries with an invalid email format
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies `email` as invalid

### Test 44: Advocate Inquiry Missing Advocacy Interests (PBI-13)
- Test scenario: POST /api/v1/advocate-inquiries with an empty `interests` array
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies `interests` as required (at least one selection)

### Test 45: Advocate Inquiry Unsupported Interest Value (PBI-13)
- Test scenario: POST /api/v1/advocate-inquiries with an `interests` value that does not match a confirmed checkbox option
- Expected HTTP status: 400 Bad Request
- Expected behavior: validation error identifies `interests` as invalid

### Test 46: Advocate Form Duplicate-Submission Prevention (PBI-13)
- Test scenario: user submits a valid Advocate Interest Form while a prior sandbox request is still in flight
- Expected behavior: the submit button is disabled and shows a "Submitting..." state until the in-flight request resolves; a second click does not trigger a second API call

### Test 47: Advocate Form Field-Level API Error Feedback (PBI-13)
- Test scenario: the sandbox API returns a `VALIDATION_ERROR` with field-level messages for an Advocate submission
- Expected behavior: the returned field errors are displayed next to the corresponding form controls, matching the pattern already used for workshop registration

---

## Milestone 3 — Test Execution Summary and Observed Results (PBI-13)

This section records what was actually executed for the Milestone-3 integration work and is maintained alongside — not as a replacement for — the authoritative project Testing Document referenced in `usability-performance-evaluation-plan.md` (reported to exist outside this repository, e.g. as a shared Google Doc; it was not supplied to this workspace and could not be updated directly as part of this work).

### Automated test execution (`npm test` / `react-scripts test --watchAll=false`)
- **Observed result:** 15 test suites / 122 tests passed after the Milestone-3 integration changes below (run with `--maxWorkers=2`; see the App.test.js flakiness note).
- Suites directly covering the contract-level tests in this document: `assistanceRequests.test.js`, `contactInquiries.test.js`, `donorInquiries.test.js`, `workshopRegistration.test.js`, `advocateInquiries.test.js`, `validationHelpers.test.js` (validation-logic/business-rule tests, Tests 1–47 above), and `Advocate.test.js`, `Contact.test.js`, `CheckoutForm.test.js`, `NeedHelp.test.js`, `WorkshopDetail.test.js` (UI-level integration tests covering success, invalid input, backend validation errors, and duplicate-submission prevention for each in-scope form).
- A dedicated validation/business-logic test module and Jest spec now exists for every `/api/v1/*` endpoint (previously only workshop registration and volunteer inquiries had one); Assistance Request, Contact Inquiry, and Donor Inquiry validation logic was extracted out of `src/mocks/handlers.js` into shared, unit-tested modules under `src/mocks/validation-logic/` and reused by the Express mock server (`src/mocks/mockServer.mjs`) so both mock layers enforce identical rules.

### Manual verification
- Started `node src/mocks/mockServer.mjs` and exercised every `/api/v1/*` endpoint plus `/api/workshops*` with `curl`/`Invoke-RestMethod`, confirming success (`201`/`200`), validation-error (`400`), not-found (`404`/unmatched route), workshop-full (`409`), and malformed-JSON (`400`) responses.
- Confirmed the Donate page's sandbox donation flow end-to-end in the existing `CheckoutForm.test.js` suite and by inspecting the MSW handler response, including the `isSimulation`/`success` fields now returned by `/api/v1/donor-inquiries` (previously missing, which meant the "Demo successful! No actual payment was processed." message would never have appeared in a real MSW-backed run of the app, only when `fetch` was mocked directly in a test).

### Defects found and fixed during this work
1. **Workshop registration regression:** a prior change (`workshopService.js`) bypassed the shared API contract entirely (importing mock data directly) and silently dropped the `registerForWorkshop` export, breaking `NeedHelp.test.js` and workshop registration. Restored the `apiRequest`/MSW-backed implementation; registration UI was moved to `WorkshopDetail.js` (previously a non-functional `// Successful sandbox submission will go here next.` stub) and the dead/commented registration-dialog code was removed from `NeedHelp.js`.
2. **Contact form had no API integration:** `Contact.js` simulated a success message locally without calling `/api/v1/contact-inquiries` at all, and lacked the contract's required `inquiryType` field. Rewired to call the sandbox API with loading, field-level, and generic-error states.
3. **Advocate form had no API integration:** the Advocate Interest Form (`src/pages/Advocate.js`, originally built on a separate branch) only simulated success locally. Added `POST /api/v1/advocate-inquiries` (MSW handler, Express route, validation module, OpenAPI/contract docs) and wired the form to it with duplicate-submission prevention and API error handling.
4. **Donor Inquiry sandbox response gap:** `CheckoutForm.js` checked for `result.isSimulation && result.success`, but the MSW/Express donor-inquiries response never included those fields, so the "Demo successful!" confirmation could never actually render outside of a test that mocks `fetch` directly. Added the additive `isSimulation`/`success` fields to the sandbox response.

### Outstanding issues / remaining work for the Milestone-3 testing-document deadline (November 22)
- The authoritative project Testing Document (referenced in `tests/usability-performance-evaluation-plan.md` as existing outside this repository) was not available to this workspace. The team should merge the automated results and defects above into that document, or confirm its repository location so future updates can be made directly.
- **Technology Help Request (REQ-21):** the `/api/v1/assistance-requests` sandbox endpoint is fully implemented, validated, and unit tested, but no dedicated standalone frontend form currently targets it — the "I Need Help" journey is represented by workshop discovery and registration instead (per the Main Backlog's description of that journey). The team should confirm whether a separate Technology Help Request form remains in scope for production release or whether workshop registration is the final intended pathway.
- **Volunteer Signup (REQ-22):** the sandbox endpoint and its handlers remain implemented and tested, but the public website currently links directly to the organization's Hands On Atlanta production signup process instead of rendering a TSLS-hosted inquiry form (sponsor-confirmed decision — see the Milestone 3 update in the Volunteer Inquiry section of `documentation/api-contract.md`). This is intentional, not a defect, and should be reflected in the authoritative Testing Document.
- `App.test.js`'s `"opens /want-to-help directly and retains the shared layout"` test was observed to fail intermittently only when the full suite runs with default Jest worker parallelism (CPU contention on this machine slowing a lazy-loaded route transition past the default timeout); it passed consistently both in isolation and with `--maxWorkers=2`. This is a pre-existing timing flake unrelated to the Milestone-3 API integration changes and was not modified.

