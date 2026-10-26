/**
 * PBI-4 API type models.
 *
 * These interfaces mirror the schemas documented in:
 * - documentation/api-contract.md (Assistance, Volunteer, Contact, Donor — REQ-21/22/23/24)
 * - documentation/openapi.json (formal OpenAPI 3.x spec for all endpoints below)
 * - documentation/milestones/Milestone-2.md (Workshop search/details — PBI-7, PBI-8, PBI-12)
 *
 * Workshop-related types are marked ASSUMPTION where the exact field name, format, or
 * shape is not literally specified in the repository documentation. They are limited to
 * fields that are clearly implied by existing project/backlog/milestone documentation.
 *
 * Phase 1 boundaries preserved (do not remove):
 * - Donor Interest/Inquiry never includes payment/card/amount fields (REQ-24, REQ-29).
 * - No Salesforce-specific fields or integrations are represented here (REQ-29).
 */

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

/** Standard error envelope shared by every endpoint (see api-contract.md "Standard Error Format"). */
export interface ApiErrorResponse {
    error: {
        code: string;
        message: string;
        fields?: Record<string, string>;
    };
}

/** Shared "received" acknowledgement shape used by all four form endpoints. */
interface InquiryAcceptedResponse {
    status: "received";
    message: string;
}

// ---------------------------------------------------------------------------
// API 1 — Assistance Request (REQ-21)
// ---------------------------------------------------------------------------

export type PreferredContactMethod = "email" | "phone";

export interface AssistanceRequest {
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
    helpCategory: string;
    description: string;
    preferredContactMethod?: PreferredContactMethod | null;
    accessibilityNeeds?: string | null;
}

export interface AssistanceRequestResponse extends InquiryAcceptedResponse {
    requestId: string;
}

// ---------------------------------------------------------------------------
// API 2 — Volunteer Inquiry (REQ-22, Figma-Confirmed)
// ---------------------------------------------------------------------------

export type ReasonForVolunteering =
    | "Classroom volunteer"
    | "Committee volunteer"
    | "Event volunteer";

export type LeadSource =
    | "Sponsor Referral"
    | "Networking Event"
    | "Drive-By/Physical Location"
    | "Board Referral"
    | "Word of mouth"
    | "Trade Show"
    | "Internet Search"
    | "Student"
    | "Friend"
    | "Gift"
    | "Google Ads"
    | "Other";

export interface VolunteerInquiry {
    firstName: string;
    lastName: string;
    email: string;
    reasonForVolunteering: ReasonForVolunteering;
    phone?: string | null;
    organizationName?: string | null;
    leadSource?: LeadSource | null;
    message?: string | null;
}

export interface VolunteerInquiryResponse extends InquiryAcceptedResponse {
    inquiryId: string;
}

// ---------------------------------------------------------------------------
// API 3 — General Contact Inquiry (REQ-23)
// ---------------------------------------------------------------------------

export interface ContactInquiry {
    firstName: string;
    lastName: string;
    email: string;
    inquiryType: string;
    phone?: string | null;
    organization?: string | null;
    message?: string | null;
}

export interface ContactInquiryResponse extends InquiryAcceptedResponse {
    inquiryId: string;
}

// ---------------------------------------------------------------------------
// API 4 — Donor Interest/Inquiry (REQ-24 — NO payment processing)
// ---------------------------------------------------------------------------

/**
 * Intentionally excludes any amount/card/payment fields. Do not add them here —
 * REQ-24 and REQ-29 explicitly exclude payment processing from Phase 1.
 */
export interface DonorInquiry {
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
    message?: string | null;
}

export interface DonorInquiryResponse extends InquiryAcceptedResponse {
    inquiryId: string;
}

// ---------------------------------------------------------------------------
// Workshop Search / Details (Milestone-2 PBI-7, PBI-8, PBI-12)
// Not part of REQ-21–29; included here to satisfy PBI-4 AC-1's "workshop search"
// and "workshop details" schema requirement using only fields the backlog documents.
// ---------------------------------------------------------------------------

/** ASSUMPTION: "In-Person vs. Virtual" filter language (PBI-7) implies this enum; not literally named in the docs. */
export type WorkshopEventType = "In-Person" | "Virtual";

/** ASSUMPTION: an "id" field is not explicitly named anywhere, but is required to link search results to a detail page and is implied by the `/workshops/[id]` route in PBI-8/PBI-12. */
export interface WorkshopSummary {
    id: string;
    title: string;
    /** ASSUMPTION: exact date/time string format is not specified in the docs. */
    date: string;
    time: string;
    address: string;
    distanceMiles: number;
    eventType: WorkshopEventType;
}

export interface WorkshopSearchResponse {
    workshops: WorkshopSummary[];
}

export interface WorkshopDetail {
    id: string;
    title: string;
    /** ASSUMPTION: PBI-8 says "date/time" as a single concept; represented here as one field. */
    dateTime: string;
    location: string;
    roomNumber: string;
    instructorName: string;
    /** ASSUMPTION: PBI-8 says "building accessibility features" with no defined shape; modeled as a string list. */
    accessibilityFeatures: string[];
    /** ASSUMPTION: PBI-8 says "seat availability" with no defined shape; modeled as a remaining-seat count. */
    seatAvailability: number;
}

export interface WorkshopDetailResponse {
    workshop: WorkshopDetail;
}

// ---------------------------------------------------------------------------
// Workshop Registration (Milestone-2 PBI-8 / PBI-12)
//
// SANDBOX / MOCK ONLY. This is a Phase 1 demonstration of the workshop
// registration journey and is not the final production registration
// workflow. See documentation/api-contract.md and mocks/README.md.
// ---------------------------------------------------------------------------

export interface WorkshopRegistrationRequest {
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
}

export interface WorkshopRegistrationResponse {
    registrationId: string;
    status: "received";
    message: string;
    workshop: {
        id: string;
        title: string;
        dateTime: string;
        location: string;
    };
}
