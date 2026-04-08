import axios from "axios";

const BASE_URL = "http://localhost:5000";

// REGISTER API
export const registerUser = (data) => {
  return axios.post(`${BASE_URL}/register`, data);
};

// LOGIN API
export const loginUser = (data) => {
  return axios.post(`${BASE_URL}/login`, data);
};

// GET USERS
export const getUsers = () => {
  return axios.get(`${BASE_URL}/users`);
};

// DELETE USER
export const deleteUser = (id) => {
  return axios.delete(`${BASE_URL}/delete-user/${id}`);
};