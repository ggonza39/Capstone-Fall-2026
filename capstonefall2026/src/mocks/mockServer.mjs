// Article followed: https://medium.com/@irbaye/setting-up-express-from-scratch-a-step-by-step-guide-cbc142213089
// Also, ChatGPT was used to help with boilerplate code and the first API method (POST volunteer-inquiries)
import express from "express";
import { pathToFileURL } from "node:url";
import { workshops, workshopSummaries } from "./data/workshops.js";
import {
  validationError,
  generateId,
  isValidZip,
} from "./validation-logic/validationHelpers.mjs";
import { validateAssistanceRequest } from "./validation-logic/assistanceRequests.mjs";
import { validateVolunteerInquiry } from "./validation-logic/volunteerInquiries.mjs";
import { validateContactInquiry } from "./validation-logic/contactInquiries.mjs";
import { validateDonorInquiry } from "./validation-logic/donorInquiries.mjs";
import { validateAdvocateInquiry } from "./validation-logic/advocateInquiries.mjs";
import {
  isWorkshopFull,
  validateWorkshopRegistration,
} from "./validation-logic/workshopRegistration.mjs";
// import cors from "cors";

/**
 * Express mock backend server (documentation/api-contract.md).
 *
 * This implements the same sandbox API contract as the MSW browser handlers
 * (src/mocks/handlers.js), sharing the same validation-logic/*.mjs modules,
 * so either layer can stand in for Team #30's real backend during Phase 1.
 * No production backend or payment processing is performed.
 */

const app = express();
const PORT = process.env.MOCK_SERVER_PORT || 4000;

// Allow browser to access this mock server
// ----- This is being removed because proxy was added to package.json - backend and frontend will be on same origin.
// app.use(cors({
//   origin: "http://localhost:3000",
// }));

// !!! IMPORTANT !!! Parse incoming JSON request bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// https://blog.postman.com/how-to-create-a-rest-api-with-node-js-and-express/
// Use async to prevent blocking

// API 1 — Assistance Request (REQ-21)
app.post("/api/v1/assistance-requests", async (req, res) => {
  const fields = validateAssistanceRequest(req.body);

  if (Object.keys(fields).length > 0) {
    return validationError(res, fields);
  }

  res.status(201).json({
    requestId: generateId("TS"),
    status: "received",
    message: "Your assistance request has been received.",
  });
});

// API 2 — Volunteer Inquiry (REQ-22)
app.post("/api/v1/volunteer-inquiries", async (req, res) => {
  const fields = validateVolunteerInquiry(req.body);

  if (Object.keys(fields).length > 0) {
    return validationError(res, fields);
  }

  res.status(201).json({
    requestId: generateId("TS"),
    status: "received",
    message: "Your volunteer inquiry has been received.",
  });
});

// API 3 — General Contact Inquiry (REQ-23)
app.post("/api/v1/contact-inquiries", async (req, res) => {
  const fields = validateContactInquiry(req.body);

  if (Object.keys(fields).length > 0) {
    return validationError(res, fields);
  }

  res.status(201).json({
    inquiryId: generateId("CI"),
    status: "received",
    message: "Your contact inquiry has been received.",
  });
});

// API 4 — Donor Interest/Inquiry (REQ-24). No payment processing.
app.post("/api/v1/donor-inquiries", async (req, res) => {
  const fields = validateDonorInquiry(req.body);

  if (Object.keys(fields).length > 0) {
    return validationError(res, fields);
  }

  // isSimulation/success are additive sandbox-only fields consumed by
  // CheckoutForm.js — see the Stripe Integration Boundary section of
  // documentation/api-contract.md.
  res.status(201).json({
    inquiryId: generateId("DI"),
    status: "received",
    message: "Your donor interest inquiry has been received.",
    isSimulation: true,
    success: true,
  });
});

// API 6 — Advocate Interest Inquiry (PBI-13). Sandbox-only; submitting this
// form does not establish the user as an official TSLS representative.
app.post("/api/v1/advocate-inquiries", async (req, res) => {
  const fields = validateAdvocateInquiry(req.body);

  if (Object.keys(fields).length > 0) {
    return validationError(res, fields);
  }

  res.status(201).json({
    inquiryId: generateId("AI"),
    status: "received",
    message: "Your advocate interest request has been received.",
  });
});

// Workshops: Search (PBI-7 / PBI-12)
app.get("/api/workshops", async (req, res) => {
  const { zip, eventType } = req.query;

  if (!isValidZip(zip)) {
    return validationError(res, { zip: "Please enter a valid 5-digit ZIP code." });
  }

  let results = workshopSummaries;

  if (eventType) {
    results = results.filter((workshop) => workshop.eventType === eventType);
  }

  res.status(200).json({ workshops: results });
});

// Workshops: Details (PBI-8 / PBI-12)
app.get("/api/workshops/:id", async (req, res) => {
  const workshop = workshops.find((item) => item.id === req.params.id);

  if (!workshop) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "The requested workshop does not exist.",
      },
    });
  }

  res.status(200).json({ workshop });
});

// Workshops: Registration (PBI-8 / PBI-12). Sandbox demonstration only.
app.post("/api/workshops/:id/registrations", async (req, res) => {
  const workshop = workshops.find((item) => item.id === req.params.id);

  if (!workshop) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "The requested workshop does not exist.",
      },
    });
  }

  if (isWorkshopFull(workshop)) {
    return res.status(409).json({
      error: {
        code: "WORKSHOP_FULL",
        message: "This workshop is full. Please choose another workshop or check back later.",
      },
    });
  }

  const fields = validateWorkshopRegistration(req.body);

  if (Object.keys(fields).length > 0) {
    return validationError(res, fields);
  }

  res.status(201).json({
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
  });
});

// Standard 404 for any other /api/* route (documentation/api-contract.md).
app.use("/api", (req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "The requested API resource does not exist.",
    },
  });
});

// Standard error-handling middleware: malformed JSON bodies surface as a 400
// VALIDATION_ERROR instead of leaking a stack trace (documentation/api-contract.md
// Security Requirements — do not expose stack traces or implementation details).
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err?.type === "entity.parse.failed") {
    return validationError(res, { body: "The request body must be valid JSON." });
  }

  console.error(err);
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected server-side error occurred.",
    },
  });
});

// Only start a listening server when this file is run directly (e.g.
// `npm run mock-server` / `node src/mocks/mockServer.mjs`). When imported by
// a Vercel serverless function (or any other module), `app` is reused
// as-is with no open port — see documentation/api-contract.md.
// Comparing resolved file:// URLs (instead of raw path strings) keeps this
// check correct on Windows, where process.argv[1] uses backslashes/drive
// letters that don't match import.meta.url's forward-slash file:// form.
const isDirectExecution =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;