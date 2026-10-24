
import { http, HttpResponse, delay } from "msw";
import { workshops, workshopSummaries } from "./data/workshops";
import { isValidZip } from "./validation-logic/validationHelpers.mjs";
import { validateVolunteerInquiry } from "./validation-logic/volunteerInquiries.mjs";
import {
  isWorkshopFull,
  validateWorkshopRegistration,
} from "./validation-logic/workshopRegistration.mjs";

/**
 * Mock Service Layer.
 *
 * Implements the documented sandbox API behavior.
 * No production backend or payment processing is performed.
 */

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

export const handlers = [
  // API 1: Assistance Request (REQ-21)
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

  // API 2: Volunteer Inquiry (REQ-22)
  http.post("/api/v1/volunteer-inquiries", async ({ request }) => {
    const body = await request.json();

    // Reuse the validation logic shared with Express.
    const fields = validateVolunteerInquiry(body);

    if (Object.keys(fields).length > 0) {
      return validationError(fields);
    }

    return HttpResponse.json(
      {
        requestId: generateId("TS"),
        status: "received",
        message: "Your volunteer inquiry has been received.",
      },
      { status: 201 }
    );
  }),

  // API 3: General Contact Inquiry (REQ-23)
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

  // API 4: Donor Interest/Inquiry (REQ-24)
  // No payment processing.
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

  // Workshops: Search (PBI-7 / PBI-12)
  http.get("/api/workshops", async ({ request }) => {
    const url = new URL(request.url);

    const zip = url.searchParams.get("zip");
    const eventType = url.searchParams.get("eventType");

    if (!isValidZip(zip)) {
      return validationError({
        zip: "Please enter a valid 5-digit ZIP code.",
      });
    }

    await delay(500);

    let results = workshopSummaries;

    if (eventType) {
      results = results.filter(
        (workshop) => workshop.eventType === eventType
      );
    }

    return HttpResponse.json(
      { workshops: results },
      { status: 200 }
    );
  }),

  // Workshops: Details (PBI-8 / PBI-12)
  http.get("/api/workshops/:id", async ({ params }) => {
    await delay(300);

    const workshop = workshops.find(
      (item) => item.id === params.id
    );

    if (!workshop) {
      return HttpResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "The requested workshop does not exist.",
          },
        },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      { workshop },
      { status: 200 }
    );
  }),

  // Workshops: Registration (PBI-8 / PBI-12)
  // Sandbox demonstration only.
  http.post(
    "/api/workshops/:id/registrations",
    async ({ request, params }) => {
      await delay(500);

      const workshop = workshops.find(
        (item) => item.id === params.id
      );

      if (!workshop) {
        return HttpResponse.json(
          {
            error: {
              code: "NOT_FOUND",
              message: "The requested workshop does not exist.",
            },
          },
          { status: 404 }
        );
      }

      if (isWorkshopFull(workshop)) {
        return HttpResponse.json(
          {
            error: {
              code: "WORKSHOP_FULL",
              message:
                "This workshop is full. Please choose another workshop or check back later.",
            },
          },
          { status: 409 }
        );
      }

      const body = await request.json();
      const fields = validateWorkshopRegistration(body);

      if (Object.keys(fields).length > 0) {
        return validationError(fields);
      }

      return HttpResponse.json(
        {
          registrationId: generateId("WR"),
          status: "received",
          message:
            "This is a sandbox registration demonstration for Milestone 2. No production workshop registration has been submitted.",
          workshop: {
            id: workshop.id,
            title: workshop.title,
            dateTime: workshop.dateTime,
            location: workshop.location,
          },
        },
        { status: 201 }
      );
    }
  ),
];
