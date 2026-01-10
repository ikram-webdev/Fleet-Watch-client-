import axios from 'axios';
// const API = axios.create({
//   // baseURL: "https://fleet-watch.onrender.com", 
//   baseURL: 'http://localhost:5000/api',
// });

const API = axios.create({
  // Live hone par ye Render ka URL use karega
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    baseURL: "https://fleet-watch.onrender.com", 

});
export default API;