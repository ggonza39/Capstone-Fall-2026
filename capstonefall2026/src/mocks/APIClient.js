import axios from 'axios';

// TODO: to improve performance in this class, cache GET results.
const apiClient = axios.create({
  baseURL: '/api', // Mock server url is localhost:4000, but proxy was added to package.json to redirect to this url.
  headers: {
    'Content-Type': 'application/json'
  },
});

// Define a generic API function
export async function apiRequest(url, method, data) {
  const response = await apiClient({
    method,
    url,
    data
  });

  return response.data;
};