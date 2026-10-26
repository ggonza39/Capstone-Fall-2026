import { workshops, workshopSummaries } from "../mocks/data/workshops.js";

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
export async function getWorkshopsByZip(zipCode) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            if (zipCode === "88888") {
                reject(new Error("Mock workshop service failure"));
                return;
            }

            if (zipCode === "99999") {
                resolve({
                    zipCode, workshops: [],
                });
                return;
            }

            resolve({
                zipCode,
                workshops: workshopSummaries,
            });
        }, 500);
    });
}

export async function getWorkshopById(id) {
    const workshop = workshops.find((item) => item.id === id);
    
    if (!workshop) {
        throw new Error("Workshop not found");
    }
    return workshop;
}