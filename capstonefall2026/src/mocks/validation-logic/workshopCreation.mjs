import { requireString } from "./validationHelpers.mjs";

/**
 * Validates workshop information before creating a sandbox record.
 * PBI-15: Create Workshop
 * 
 * Returns field-specific errors without modifying workshop data.
 * This validation is for demonstration purposes only.
 */

export function validateWorkshopCreation(body) {
    const fields = {};

    // Validate required workshop information.

    if (!requireString(body?.title)) {
        fields.title = "Workshop title is required.";
    }

    if (
        !requireString(body?.dateTime) || 
        Number.isNaN(Date.parse(body.dateTime))
    ) {
        fields.dateTime = "Enter a valid workshop date and time.";
    }

    if (!requireString(body?.location)) {
        fields.location = "Workshop location is required.";
    }

    if (!requireString(body?.instructorName)) {
        fields.instructorName = "Instructor name is required.";
    }

    // Seat availability must be a non-negative whole number.
    if (
        typeof body?.seatAvailability !== "number" ||
        !Number.isInteger(body.seatAvailability) ||
        body.seatAvailability < 0
    ) {
        fields.seatAvailability = "Enter a valid number of available seats (0 or more).";
    }

    // Optional fields must use the expected data types when provided.
    if (
        body?.roomNumber != null && 
        typeof body.roomNumber !== "string"
    ) {
        fields.roomNumber = "Room number must be text.";
    }

    if (
        body?.accessibilityFeatures != null &&
        (
            !Array.isArray(body.accessibilityFeatures) ||
            !body.accessibilityFeatures.every(
                (feature) => requireString(feature)
            )
        )
    ) {
        fields.accessibilityFeatures = 
            "Accessibility features must be a list of non-empty text values.";
    }

    return fields;

}