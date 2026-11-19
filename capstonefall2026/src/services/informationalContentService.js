import { apiRequest } from "../mocks/APIClient";

export async function getParagraphs(pageType) {
    const data = await apiRequest(`/v1/paragraphs/${pageType}`, "GET");
    return data.paragraphs;
}

export async function updateParagraph(paragraphId, pageType, newContent) {
    const data = await apiRequest(`/v1/paragraphs/${paragraphId}/pageType/${pageType}`, "PUT", newContent);
    
    return {
        updateId: data.updateId,
        paragraphId: paragraphId,
        message: data.message
    };
}