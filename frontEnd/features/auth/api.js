import axios from '../../lib/axios';

export const loginApi = (email, password) =>
  axios.post('/login', { email, password });

export const signUpApi = (firstname, lastname, email, password) => {
  axios.post('/signUp', { firstname, lastname, email, password });
};

export const isAuthenticatedApi = () => axios.get('/me');

export const logOutApi = () => axios.get('/logout');
