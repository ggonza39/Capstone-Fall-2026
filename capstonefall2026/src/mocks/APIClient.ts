import axios, { AxiosResponse } from 'axios';
import { VolunteerInquiry, VolunteerInquiryResponse } from "../types/api.js"

const apiClient = axios.create({
  baseURL: 'http://localhost:4000', // Mock server url
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
  return await apiRequest<VolunteerInquiryResponse>('/api/v1/volunteer-inquiries', 'POST', userData);
};