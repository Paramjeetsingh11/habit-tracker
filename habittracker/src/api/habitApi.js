import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const getHabits = (userId) => {
  return axios.get(`${BASE_URL}/habits/${userId}`);
};

export const addHabit = (data) => {
  return axios.post(`${BASE_URL}/add-habit`, data);
};

export const updateHabit = (id, data) => {
  return axios.put(`${BASE_URL}/update-habit/${id}`, data);
};

export const deleteHabit = (id) => {
  return axios.delete(`${BASE_URL}/delete-habit/${id}`);
};

export const getLogs = (habitId) => {
  return axios.get(`http://localhost:5000/logs/${habitId}`);
};

export const markHabit = (data) => {
  return axios.post("http://localhost:5000/mark", data);
};
