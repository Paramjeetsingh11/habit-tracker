// src/api/habitApi.js
import axios from "axios";

// ✅ BASE URL
const BASE_URL = "http://localhost:5000";

// ================= HABITS =================

// GET ALL HABITS
export const getHabits = (userId) => {
  return axios.get(`${BASE_URL}/habits/${userId}`);
};

// ADD HABIT
export const addHabit = (data) => {
  return axios.post(`${BASE_URL}/add-habit`, data);
};

// UPDATE HABIT
export const updateHabit = (id, data) => {
  return axios.put(`${BASE_URL}/update-habit/${id}`, data);
};

// DELETE HABIT
export const deleteHabit = (id) => {
  return axios.delete(`${BASE_URL}/delete-habit/${id}`);
};

// ================= LOGS =================

// GET LOGS FOR CALENDAR
export const getLogs = (habitId) => {
  return axios.get(`${BASE_URL}/logs/${habitId}`);
};

// MARK / TOGGLE HABIT
export const markHabit = (data) => {
  return axios.post(`${BASE_URL}/mark`, data);
};

// ================= STREAK =================

// ✅ CORRECT FRONTEND API CALL
export const getStreak = (habitId) => {
  return axios.get(`${BASE_URL}/streak/${habitId}`);
};