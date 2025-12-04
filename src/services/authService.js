import axios from 'axios'; 

const API_URL = 'http://gsb.julliand.etu.lmdsio.com/api/';

export const signIn = async (login, password) => { 
const response = await axios.post(`${API_URL}visiteur/login`, {login: login, 
password: password }); 
if (response.data.access_token) { 
localStorage.setItem('user', JSON.stringify(response.data.visiteur)); 
localStorage.setItem('token', response.data.access_token); 
} 
return response.data; 
};

export const logout = () => { 
localStorage.removeItem('user'); 
localStorage.removeItem('token'); 
}; 

export const getCurrentUser = () => { 
return JSON.parse(localStorage.getItem('user')); 
}; 
export const getAuthToken = () => { 
return localStorage.getItem('token'); 
};
export { API_URL };