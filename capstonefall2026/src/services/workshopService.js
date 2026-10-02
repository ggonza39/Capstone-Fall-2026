import { apiRequest } from "../mocks/APIClient";

/**
 * Workshop service / adapter layer (Milestone-2 PBI-12).
 *
 * This is the single frontend integration boundary for workshop search,
 * workshop details, and workshop registration. It talks to the shared
 * /api/workshops* contract (documentation/api-contract.md) instead of
 * importing mock data directly, so the Mock Service Worker sandbox
 * (src/mocks/handlers.js) can be swapped for Team #30's production API
 * later with no changes required in the pages that call these functions.
 */
export async function getWorkshopsByZip(zipCode, eventType) {
    const params = new URLSearchParams({ zip: zipCode });

    if (eventType) {
        params.set("eventType", eventType);
    }

    const data = await apiRequest(`/workshops?${params.toString()}`, "GET");

    return {
        zipCode,
        workshops: data.workshops,
    };
}

export async function getWorkshopById(workshopId) {
    const data = await apiRequest(`/workshops/${workshopId}`, "GET");

    return data.workshop;
}

/**
 * Submits the Phase 1 sandbox workshop-registration demonstration
 * (PBI-8 / PBI-12). This is NOT a production registration workflow — see
 * the response `message` field and documentation/api-contract.md.
 */
export async function registerForWorkshop(workshopId, registration) {
    return apiRequest(`/workshops/${workshopId}/registrations`, "POST", registration);
}
