import { workshops, workshopSummaries } from "../mocks/data/workshops.js";

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

export async function getWorkshopById(id) {
    const workshop = workshops.find((item) => item.id === id);
    
    if (!workshop) {
        throw new Error("Workshop not found");
    }
    return workshop;
}