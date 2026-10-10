import axios from "axios";

// One axios instance for the whole app.
// withCredentials: true is IMPORTANT because the backend stores the
// login token in a cookie, so we must send the cookie with every request.
const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

export default api;
