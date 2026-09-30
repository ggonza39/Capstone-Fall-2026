import { workshopSummaries } from "../mocks/data/workshops.js";

/**
 * Mock workshop search service.
 *
 * This simulates the future backend API 
 * 
 */
export async function getWorkshopsByZip(zipCode) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                zipCode,
                workshops: workshopSummaries,
            });
        }, 500);
    });
}
