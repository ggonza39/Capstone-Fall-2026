import { EMAIL_PATTERN, requireString } from "./validationHelpers.mjs";

/**
 * Pure validation/business-logic helpers for the Milestone-1 sandbox
 * Assistance Request endpoint (REQ-21 — SANDBOX ONLY).
 *
 * Extracted out of src/mocks/handlers.js so the rules can be shared with the
 * Express mock server (src/mocks/mockServer.mjs) and unit tested directly,
 * following the same pattern already used for volunteer inquiries.
 */
function validateAssistanceRequest(body) {
    const fields = {};

    if (!requireString(body.firstName)) {
        fields.firstName = "First name is required.";
    }

    if (!requireString(body.lastName)) {
        fields.lastName = "Last name is required.";
    }

    if (!requireString(body.email) && !requireString(body.phone)) {
        fields.email = "Provide an email address or phone number.";
    }

    if (body.email && !EMAIL_PATTERN.test(body.email)) {
        fields.email = "Enter a valid email address.";
    }

    if (!requireString(body.helpCategory)) {
        fields.helpCategory = "Help category is required.";
    }

    if (!requireString(body.description)) {
        fields.description = "Description is required.";
    }

    return fields;
}

export { validateAssistanceRequest };
