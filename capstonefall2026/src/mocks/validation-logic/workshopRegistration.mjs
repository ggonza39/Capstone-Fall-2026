import { requireString, EMAIL_PATTERN } from "./validationHelpers.mjs";

/**
 * Pure validation/business-logic helpers for the Milestone-2 sandbox
 * workshop-registration endpoint (PBI-8 / PBI-12 — SANDBOX ONLY).
 *
 * Extracted out of src/mocks/handlers.js so the rules can be unit tested
 * directly, following the same pattern already used for volunteer inquiries
 * (see validation-logic/volunteerInquiries.mjs).
 */

export function validateWorkshopRegistration(body) {
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

    return fields;
}

/** A workshop is treated as full/unavailable once its mock seat count reaches zero. */
export function isWorkshopFull(workshop) {
    return !workshop || workshop.seatAvailability <= 0;
}
