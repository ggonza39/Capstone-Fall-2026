import axios, { AxiosResponse } from 'axios';
import { VolunteerInquiry, VolunteerInquiryResponse } from "../types/api.js"

// TODO: to improve performance in this class, cache GET results.
const apiClient = axios.create({
  baseURL: '/api', // Mock server url is localhost:4000, but proxy was added to package.json to redirect to this url.
  headers: {
    'Content-Type': 'application/json'
  },
});

// Define a generic API function
export const apiRequest = async <T>(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient({
    method,
    url,
    data
  });

  return response.data;
};

// Function to create a new user
export const createVolunteerInquiry = async (userData: VolunteerInquiry): Promise<VolunteerInquiryResponse> => {
  return await apiRequest<VolunteerInquiryResponse>('/v1/volunteer-inquiries', 'POST', userData);
};