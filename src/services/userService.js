import axios from "axios";

const API_BASE_URL = "http://localhost:8080/users";

export const getAllUsers = () => axios.get(`${API_BASE_URL}/all`);
export const deleteUser = (id) => axios.delete(`${API_BASE_URL}/delete/${id}`);
export const updateUser = (id, updatedData) =>
  axios.put(`${API_BASE_URL}/update/${id}`, updatedData);
export const getusername = (name) => axios.get(`${API_BASE_URL}/name/${name}`);
export const addUser = (userData) => axios.post(`${API_BASE_URL}/add`, userData);

export const getrole = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/role/${id}`);
    return response.data.role; // Ensure only data is returned
  } catch (error) {
    console.error("Error fetching role:", error);
    return null;
  }
};

export const hasUserPurchasedBook = async (userId, bookId) => {
  const response = await axios.get(`${API_BASE_URL}/users/${userId}/books/${bookId}/purchased`);
  return response.data; // ✅ Returns true or false
};



