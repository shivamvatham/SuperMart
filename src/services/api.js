import axios from 'axios';
// import err from '@/utils/error'; // Uncomment if you have a custom error handler

const apiService = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'https://fakestoreapi.com',
  timeout: 10000,
});

apiService.interceptors.request.use(
  (config) => {
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    // return err(error); // Uncomment if you have a custom error handler
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

export default apiService;