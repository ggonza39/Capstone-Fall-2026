import { apiRequest } from "../mocks/APIClient";

export async function donate(userDetails) {
    const data = await apiRequest(`/v1/donor-inquiries`, "POST", userDetails);
    return data;
}