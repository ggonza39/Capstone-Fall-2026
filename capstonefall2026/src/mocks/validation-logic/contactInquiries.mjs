import { EMAIL_PATTERN, requireString } from "./validationHelpers.mjs";

/**
 * Pure validation/business-logic helpers for the Milestone-1 sandbox
 * General Contact Inquiry endpoint (REQ-23 — SANDBOX ONLY).
 *
 * Extracted out of src/mocks/handlers.js so the rules can be shared with the
 * Express mock server (src/mocks/mockServer.mjs) and unit tested directly,
 * following the same pattern already used for volunteer inquiries.
 */
function validateContactInquiry(body) {
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

    if (!requireString(body.inquiryType)) {
        fields.inquiryType = "Please select a valid inquiry type.";
    }

    return fields;
}

export { validateContactInquiry };
