import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email, password) => api.post("/auth/login", { email, password }),
};

export const employeeService = {
  create: (data) => api.post("/employees", data),
  getAll: () => api.get("/employees"),
  getOne: (id) => api.get(`/employees/${id}`),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
};

export const attendanceService = {
  create: (data) => api.post("/attendance", data),
  getAll: () => api.get("/attendance"),
  getMyAttendance: () => api.get("/attendance/my"),
  getOne: (id) => api.get(`/attendance/${id}`),
};

export const uploadService = {
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default api;
