import { apiRequest } from "../mocks/APIClient";

export async function authenticate(credentials) {
    const data = await apiRequest(`/v1/authenticate`, "POST", credentials);
    return data;
}

