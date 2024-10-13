import Axios from 'axios';

const axios = Axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: true, // use cookies
});

axios.interceptors.response.use((response) => response.data);

export default axios;
