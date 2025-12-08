// src/utils/axiosSetup.js
import axios from 'axios';

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 ||
        error.response.data.message === 'User blocked' ||
        error.response.data.message === 'jwt malformed' ||
        error.response.data.message === 'jwt expired')
    ) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;
