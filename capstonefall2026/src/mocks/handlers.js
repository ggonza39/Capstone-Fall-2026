import { http, HttpResponse } from "msw";
import { workshops, workshopSummaries } from "./data/workshops";
/**
 * Mock Service Layer (PBI-4, Acceptance Criterion 3).
 *
 * Handlers mirror the request/response behavior already documented in
 * mocks/README.md and documentation/api-contract.md. This file implements
 * that documentation as runnable MSW handlers; it does not change or
 * extend the documented contract.
 */

const REASONS_FOR_VOLUNTEERING = [
    "Classroom volunteer",
    "Committee volunteer",
    "Event volunteer",
];

const LEAD_SOURCES = [
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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validationError(fields) {
    return HttpResponse.json(
        {
            error: {
                code: "VALIDATION_ERROR",
                message: "The request contains invalid or missing information.",
                fields,
            },
        },
        { status: 400 }
    );
}

function requireString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

let nextId = 1001;

function generateId(prefix) {
    return `${prefix}-${nextId++}`;
}


// --------- Handlers ----------------
export const handlers = [
    // --- API 1: Assistance Request (REQ-21) ---
    http.post("/api/v1/assistance-requests", async ({ request }) => {
        const body = await request.json();
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

        if (Object.keys(fields).length > 0) {
            return validationError(fields);
        }

        return HttpResponse.json(
            {
                requestId: generateId("TS"),
                status: "received",
                message: "Your assistance request has been received.",
            },
            { status: 201 }
        );
    }),

    // --- API 2: Volunteer Inquiry (REQ-22, Figma-Confirmed) ---
    // ---------- NEW: Validation logic was moved to separate file, and code was moved to mockServer.mjs so that it can be run and tested from both the browser and Postman.
    // ---------- To run: npm install > npm run mock-server > execute POST localhost:4000/api/v1/volunteer-inquiries in Postman.
    // -------------------------------------------------------------
    // http.post("/api/v1/volunteer-inquiries", async ({ request }) => {
    //     const body = await request.json();
    //     const result = await createVolunteerInquiry(body);

    //     return HttpResponse.json(result.body, {
    //         status: result.status,
    //     });
    // }),

    // --- API 3: General Contact Inquiry (REQ-23) ---
    http.post("/api/v1/contact-inquiries", async ({ request }) => {
        const body = await request.json();
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

        if (Object.keys(fields).length > 0) {
            return validationError(fields);
        }

        return HttpResponse.json(
            {
                inquiryId: generateId("CI"),
                status: "received",
                message: "Your contact inquiry has been received.",
            },
            { status: 201 }
        );
    }),

    // --- API 4: Donor Interest/Inquiry (REQ-24 — NO payment processing) ---
    http.post("/api/v1/donor-inquiries", async ({ request }) => {
        const body = await request.json();
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

        // Phase 1 boundary:
        // Payment information is not accepted or processed.
        const prohibitedPaymentFields = [
            "amount",
            "cardNumber",
            "cvv",
            "paymentToken",
            "paymentMethod",
        ];

        for (const field of prohibitedPaymentFields) {
            if (Object.prototype.hasOwnProperty.call(body, field)) {
                fields[field] =
                    "Payment information is not accepted in Phase 1.";
            }
        }

        if (Object.keys(fields).length > 0) {
            return validationError(fields);
        }

        return HttpResponse.json(
            {
                inquiryId: generateId("DI"),
                status: "received",
                message: "Your donor interest inquiry has been received.",
            },
            { status: 201 }
        );
    }),

    // --- Workshops: Search (Milestone-2 PBI-7 / PBI-12) ---
    http.get("/api/workshops", ({ request }) => {
        const url = new URL(request.url);

        const zip = url.searchParams.get("zip");
        const eventType = url.searchParams.get("eventType");

        if (!zip || !/^\d{5}$/.test(zip)) {
            return validationError({
                zip: "Please enter a valid 5-digit ZIP code.",
            });
        }

        let results = workshopSummaries;

        if (eventType) {
            results = results.filter(
                (workshop) => workshop.eventType === eventType
            );
        }

        return HttpResponse.json(
            {
                workshops: results,
            },
            { status: 200 }
        );
    }),

    // --- Workshops: Details (Milestone-2 PBI-8 / PBI-12) ---
    http.get("/api/workshops/:id", ({ params }) => {
        const workshop = workshops.find(
            (item) => item.id === params.id
        );

        if (!workshop) {
            return HttpResponse.json(
                {
                    error: {
                        code: "NOT_FOUND",
                        message:
                            "The requested workshop does not exist.",
                    },
                },
                { status: 404 }
            );
        }

        return HttpResponse.json(
            {
                workshop,
            },
            { status: 200 }
        );
    }),
];
