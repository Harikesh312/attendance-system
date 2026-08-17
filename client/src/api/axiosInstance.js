import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // We check both local storages for tokens
    const adminToken = localStorage.getItem('admin_token');
    const studentToken = localStorage.getItem('student_token');
    
    // We figure out which token to use based on the URL or just pass whichever exists
    // Since roles are isolated by route, we'll try admin token for admin routes
    if (config.url.includes('/admin') && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (config.url.includes('/student') && studentToken) {
      config.headers.Authorization = `Bearer ${studentToken}`;
    } else {
      // Fallback
      const token = adminToken || studentToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
