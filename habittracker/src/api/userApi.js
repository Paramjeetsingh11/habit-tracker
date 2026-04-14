// ✅ src/api/userApi.js
import axios from "axios";

// ✅ Base URL (NO trailing slash)
const BASE_URL = "http://localhost:5000";

// ✅ SEND OTP
export const sendOtp = (email) => {
  return axios.post(`${BASE_URL}/send-otp`, { email });
};

// ✅ REGISTER
export const registerUser = (data) => {
  return axios.post(`${BASE_URL}/register`, data);
};

// ✅ LOGIN
export const loginUser = (data) => {
  return axios.post(`${BASE_URL}/login`, data);
};

// ✅ GET USERS
export const getUsers = () => {
  return axios.get("http://localhost:5000/users");
};

// ✅ DELETE USER
export const deleteUser = (id) => {
  return axios.delete(`http://localhost:5000/delete-user/${id}`);
};

export const resetPassword = (data) => {
  return axios.post(`${BASE_URL}/reset-password`, data);
};
// ✅ VERIFY OTP
export const verifyOtp = (data) => {
  return axios.post(`${BASE_URL}/verify-otp`, data);
};