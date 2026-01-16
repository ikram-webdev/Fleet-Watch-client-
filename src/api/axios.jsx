import axios from "axios";
const API = axios.create({
  baseURL: "https://fleet-watch.onrender.com/api",
});
export default API;
