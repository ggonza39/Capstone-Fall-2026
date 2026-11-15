import { apiRequest } from "../mocks/APIClient";

export async function getParagraphs(pageType) {
    const data = await apiRequest(`/v1/paragraphs/${pageType}`, "GET");
    return data.paragraphs;
}