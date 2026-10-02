let nextId = 1001;

export const REASONS_FOR_VOLUNTEERING = [
    "Classroom volunteer",
    "Committee volunteer",
    "Event volunteer",
];

export const LEAD_SOURCES = [
    "Sponsor Referral",
    "Networking Event",
    "Drive-By/Physical Location",
    "Board Referral",
    "Word of mouth",
    "Trade Show",
    "Internet Search",
    "Student",
    "Friend",
    "Gift",
    "Google Ads",
    "Other",
];

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Shared ZIP-code validation rule used by the workshop search endpoint (PBI-7 / PBI-12). */
export const ZIP_PATTERN = /^\d{5}$/;

export function isValidZip(zip) {
    return typeof zip === "string" && ZIP_PATTERN.test(zip);
}

export function validationError(res, fields) {
    return res.status(400).json({
        error: {
            code: "VALIDATION_ERROR",
            message: "The request contains invalid or missing information.",
            fields,
        }
    });
}

export function generateId(prefix) {
    return `${prefix}-${nextId++}`;
}

export function requireString(value) {
    return typeof value === "string" && value.trim().length > 0;
}