#PBI 13 Public Forms Audit and Production Integration

## 1. Purpose

This file documents the review and testing of TSLS public forms.

It evaluates form labels, validation and error feedback, keyboard navigation and screen reader accessibility, submission messages, and integration boundaries. 


## 3. Validation and Accessibility Testing of Public Forms

The public forms were reviewed through code inspection, manual browser testing, keyboard navigation, and selected automated tests.

### Testing Results

| Form | Validation | Keyboard Accessibility | Screen Reader Testing | Submission Feedback |
|---|---|---|---|---|
| Advocate Interest Form | Passed | Passed | Passed | Passed — sandbox confirmation |
| General Contact Form | Passed | Passed | Passed | Passed — sandbox confirmation |
| Donation Inquiry | Passed | Passed | Passed | Mock API behavior reviewed; automated tests passed |
| Workshop Registration | Passed | Passed | Passed | Passed — sandbox confirmation |
| Home ZIP Search | Passed | Passed | Passed | Valid ZIP navigation confirmed |
| Need Help Workshop Search | Passed | Passed | Passed | Search results and validation feedback confirmed |

### Required Fields Validation

Required fields were verified to determine whether empty or invalid submissions gave clear error messages.

### Keyboard Accessibility

Keyboard testing ensured whether users could reach and use form controls without a mouse.

### Screen Reader Accessibility

VoiceOver testing was performed on forms using macOS.

**Results:**
- Test suites: 1 passed
- Tests: 8 passed
- Failures: 0

**Command executed:**

`CI=true npm test -- --watch=false --runTestsByPath src/pages/CheckoutForm.test.js`

## 4. Outstanding Defects and Follow-Up Items

| ID | Outstanding Issue | Priority | Status |
|---|---|---|---|
| PBI13-01 | Complete remaining VoiceOver and accessibility checks for the Contact and Donation forms. | Low | Partially Verified |
| PBI13-02 | Workshop registration dialog in `NeedHelp.js` is commented out. Confirm whether this is intentional. | Medium | Pending Team Confirmation |
| PBI13-03 | Production API integrations have not been verified end-to-end. Needs to be coordinated with future Backend Team #30. | Medium | Pending Backend Integration |
| PBI13-04 | Volunteer registration redirects to Hands On Atlanta. No local signup form was identified; confirm the intended workflow/form with the team. | Low | Partially Verified |
| PBI13-05 | No dedicated Technology Help Request form was found in the reviewed frontend pages. Confirm implementation scope and ownership. | Medium | Pending Team Confirmation |
| PBI13-06 | Successful Donation form submission has passed automated tests but was not been manually verified in the browser. | Low | Pending Verification |

## 2. Resolved Issues

| Issue | Resolution | Status |
|---|---|---|
| Contact form displayed a misleading success message. | Updated the confirmation to clarify that submissions are demonstration-only and are not sent to production. | Resolved |
| Donation form lacked a demonstration disclaimer. | Added a visible disclaimer explaining that no actual payments are processed or collected. | Resolved |
| Dedicated Advocate Interest Form was not implemented. | Created an accessible sandbox form with validation, keyboard support, and submission feedback. | Resolved |

## 5. Summary

The remaining items primarily involve testing gaps, integration dependencies, and team confirmation.

**Note:** Not every outstanding issue is a confirmed defect. Some tasks or implementation decisions requires the team to review.
