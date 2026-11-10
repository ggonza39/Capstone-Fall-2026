import { ADVOCACY_INTERESTS, EMAIL_PATTERN, requireString } from "./validationHelpers.mjs";

/**
 * Pure validation/business-logic helpers for the Milestone-3 sandbox
 * Advocate Interest Inquiry endpoint (PBI-13 — SANDBOX ONLY).
 *
 * Follows the same pattern already used for volunteer inquiries (see
 * validation-logic/volunteerInquiries.mjs) so the rules can be shared and
 * unit tested directly by both the MSW handlers and the Express mock server.
 */
function validateAdvocateInquiry(body) {
    const fields = {};

    if (!requireString(body.firstName)) {
        fields.firstName = "First name is required.";
    }

    if (!requireString(body.lastName)) {
        fields.lastName = "Last name is required.";
    }

    if (!requireString(body.email)) {
        fields.email = "Email is required.";
    } else if (!EMAIL_PATTERN.test(body.email)) {
        fields.email = "Enter a valid email address.";
    }

    if (!Array.isArray(body.interests) || body.interests.length === 0) {
        fields.interests = "Select at least one advocacy interest.";
    } else if (!body.interests.every((interest) => ADVOCACY_INTERESTS.includes(interest))) {
        fields.interests = "Please select a valid advocacy interest.";
    }

    if (!requireString(body.message)) {
        fields.message = "Tell us about your interest in supporting TSLS.";
    }

    return fields;
}

export { validateAdvocateInquiry };
