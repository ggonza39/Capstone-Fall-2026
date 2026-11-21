import { apiRequest } from "../mocks/APIClient";

// !!!!!!!! IMPORTANT !!!!!!!!!!!
// 👇👇👇👇👇👇👇👇👇👇👇👇
// See sandboxAccess.js and handlers.js for fallback username and password,
// which need to be replaced when backend team implements this endpoint.
export async function authenticate(credentials) {
    const data = await apiRequest(`/v1/authenticate`, "POST", credentials);
    return data;
}

