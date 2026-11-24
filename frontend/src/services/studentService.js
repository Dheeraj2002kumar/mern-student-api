import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getStudents = () => API.get("/");

export const addStudent = (student) => API.post("/", student);

export const updateStudent = (id, student) => API.put(`/${id}`, student);

export const deleteStudent = (id) => API.delete(`/${id}`);
