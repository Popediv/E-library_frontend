import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change to your backend URL
  withCredentials: true // Include cookies for authentication if your backend uses them
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auto logout if suspended or token expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 403 && message?.includes('suspended')) {
      localStorage.removeItem('user');
      alert('Your account has been suspended. Contact the library admin.');
      window.location.href = '/login';
    }

    if (status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;