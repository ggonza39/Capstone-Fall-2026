
import { http, HttpResponse, delay } from "msw";
import { workshops, workshopSummaries } from "./data/workshops";
import { isValidZip } from "./validation-logic/validationHelpers.mjs";
import { validateAssistanceRequest } from "./validation-logic/assistanceRequests.mjs";
import { validateVolunteerInquiry } from "./validation-logic/volunteerInquiries.mjs";
import { validateContactInquiry } from "./validation-logic/contactInquiries.mjs";
import { validateDonorInquiry } from "./validation-logic/donorInquiries.mjs";
import { validateAdvocateInquiry } from "./validation-logic/advocateInquiries.mjs";
import {
  isWorkshopFull,
  validateWorkshopRegistration,
} from "./validation-logic/workshopRegistration.mjs";
import { landingPageParagraphs, impactComponentParagraphs } from './data/paragraphs';
import PageType  from "./pageTypeEnum";
import { validateWorkshopCreation } from "./validation-logic/workshopCreation.mjs";

/**
 * Mock Service Layer.
 *
 * Implements the documented sandbox API behavior.
 * No production backend or payment processing is performed.
 *
 * Validation/business-logic rules live in ./validation-logic/*.mjs so they
 * can be shared with the Express mock server (src/mocks/mockServer.mjs) and
 * unit tested directly, rather than duplicated here.
 */

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

let nextId = 1001;

/**
 * Generates unique workshop IDs for sandbox records.
 * Keeps workshop IDs separate from other mock API records.
 */

// Separate counter for sandbox workshop IDs.
let nextWorkshopId = 1004;

function generateWorkshopId() {
  const existingIds = new Set(
    workshops.map((workshop) => workshop.id)
  );

  let candidateId = `WS-${nextWorkshopId++}`;

  while (existingIds.has(candidateId)) {
    candidateId = `WS-${nextWorkshopId++}`;
  }

  return candidateId;
}

function generateId(prefix) {
  return `${prefix}-${nextId++}`;
}

export const handlers = [
  // API 1: Assistance Request (REQ-21)
  http.post("/api/v1/assistance-requests", async ({ request }) => {
    const body = await request.json();

    const fields = validateAssistanceRequest(body);

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

    const fields = validateContactInquiry(body);

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

    const fields = validateDonorInquiry(body);

    if (Object.keys(fields).length > 0) {
      return validationError(fields);
    }

    // isSimulation/success are additive sandbox-only fields (not part of the
    // Sponsor-Confirmed contract fields) consumed by CheckoutForm.js to show a
    // clear "no real payment was processed" confirmation message — see the
    // Stripe Integration Boundary section of documentation/api-contract.md.
    return HttpResponse.json(
      {
        inquiryId: generateId("DI"),
        status: "received",
        message: "Your donor interest inquiry has been received.",
        isSimulation: true,
        success: true,
      },
      { status: 201 }
    );
  }),

  // API 6 — Advocate Interest Inquiry (PBI-13)
  // Sandbox-only. Submitting this form does not establish the user as an
  // official TSLS representative or advocate.
  http.post("/api/v1/advocate-inquiries", async ({ request }) => {
    const body = await request.json();

    const fields = validateAdvocateInquiry(body);

    if (Object.keys(fields).length > 0) {
      return validationError(fields);
    }

    return HttpResponse.json(
      {
        inquiryId: generateId("AI"),
        status: "received",
        message: "Your advocate interest request has been received.",
      },
      { status: 201 }
    );
  }),

// Workshops: Create (PBI-15)
// Sandbox only - create an in-memory workshop record.
http.post("/api/workshops", async ({ request }) => {
  let body;

  try {
    body = await request.json();
  } catch {
    return validationError({
      request: "Enter valid workshop information.",
    });
  }

  // Validate the submitted workshop fields before saving.

  const fields = validateWorkshopCreation(body);

  if (Object.keys(fields).length > 0) {

    return validationError(fields);

  }

  // Create a workshop using the existing WorkshopDetail structure.

  const workshop = {

    id: generateWorkshopId(),

    title: body.title.trim(),

    dateTime: body.dateTime,

    location: body.location.trim(),

    roomNumber: (body.roomNumber || "").trim(),

    instructorName: body.instructorName.trim(),

    accessibilityFeatures: body.accessibilityFeatures || [],

    seatAvailability: body.seatAvailability,

  };

  // Save the workshop in the sandbox's in-memory data.

  workshops.push(workshop);

  // Keep the workshop search results consistent with the detail records.

  const [date, time] = workshop.dateTime.split("T");

  workshopSummaries.push({

    id: workshop.id,

    title: workshop.title,

    date,

    time: time ? time.slice(0, 5) : "",

    address: workshop.location,

    distanceMiles: 0,

    eventType: workshop.location.toLowerCase() === "online"

      ? "Virtual"

      : "In-Person",

  });

  await delay(300);

  return HttpResponse.json(

    {

      workshop,

      message: "Workshop created successfully in the sandbox.",

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

  // Informational Content Updates (Milestone 3)
  // GetParagraphs method
  // ChatGPT was used for assistance in creating this method: getting pageType, Object.values and response object structure.
  http.get("/api/v1/paragraphs/:pageType", async ({ params }) => {
    await delay(300); 

    var pageType = Number(params.pageType);

    if(!Object.values(PageType).includes(pageType)) {
      return HttpResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "The requested paragraphs were not found."
          }
        }
      )
    }

    if(pageType === PageType.Landing) {
      return HttpResponse.json(
          { paragraphs: landingPageParagraphs },
          { status: 200 }
      );
    }
    else if(pageType === PageType.WantToHelp) {
      return HttpResponse.json( 
        { paragraphs: impactComponentParagraphs },
        { status: 200 }
      );
    }
  }
  ),

   http.put("/api/v1/paragraphs/:id/pageType/:pageType", async ({ params }) => {
    await delay(300); 

    var paragraphId = params.id;
    var pageType = Number(params.pageType);

    if(!Object.values(PageType).includes(pageType)) {
      return HttpResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "The requested paragraphs were not found."
          }
        }
      );
    }

    var fromParagraphs = null; 
    
    // Simulate mock query FROM paragraphs WHERE pageType = <pageType> && paragraphId = <id>
    switch(pageType) {
        case PageType.Landing:
            fromParagraphs = landingPageParagraphs;
            break;
        case PageType.WantToHelp:
            fromParagraphs = impactComponentParagraphs;
            break;
        default:
            fromParagraphs = landingPageParagraphs;
            break;
    } 

    const paragraph = fromParagraphs.find(
        (paragraph) => paragraph.id === paragraphId
    );

    if(!paragraph) {
      return HttpResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "The requested paragraph was not found."
          }
        }
      )
    }

    return HttpResponse.json(
        {
            updateId: generateId("AI"),
            status: "updated",
            message: "The selected paragraph has been updated."
        },
        { status: 201 } 
    );
   }
),

http.post("/api/v1/authenticate", async ({ request }) => {
    await delay(300); 

    // https://mswjs.io/docs/http/intercepting-requests/body
    var body = await request.json();

    var username = body.username;
    var password = body.password;

    // Whoever replaces this with backend in future: please use a different username and password in database,
    // because these credentials have been exposed to a public Git repo.
    if(username === "admin" && password === "admin123") {
        return HttpResponse.json(
        {
            status: "success",
            message: "Success! Logging in..."
        },
        { status: 201 } 
    )
    }

    return HttpResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "A user with the entered username and password was not found. Please try again."
          }
        }
      )
}
),
];