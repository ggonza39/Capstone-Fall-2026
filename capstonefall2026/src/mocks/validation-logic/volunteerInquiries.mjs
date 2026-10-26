import {
    REASONS_FOR_VOLUNTEERING,
    LEAD_SOURCES,
    EMAIL_PATTERN,
    requireString
} from "./validationHelpers.mjs";

// Validation logic
function validateVolunteerInquiry(body) {
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

    if (!requireString(body.reasonForVolunteering)) {
        fields.reasonForVolunteering =
            "Reason for volunteering is required.";
    } else if (
        !REASONS_FOR_VOLUNTEERING.includes(body.reasonForVolunteering)
    ) {
        fields.reasonForVolunteering =
            "Please select a valid reason for volunteering.";
    }

    if (
        body.leadSource &&
        !LEAD_SOURCES.includes(body.leadSource)
    ) {
        fields.leadSource = "Please select a valid lead source.";
    }

    return fields;
}

export { validateVolunteerInquiry };