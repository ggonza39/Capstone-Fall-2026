import { workshopSummaries } from "../mocks/data/workshops.js";

/**
 * Mock workshop search service.
 *
 * This simulates the future backend API 
 * 
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
