import axios from "axios";

const BOOKS_API_BASE_URL = "http://localhost:8080/books";
const PURCHASES_API_BASE_URL = "http://localhost:8080/purchases";

export const getBooks = () => axios.get(`${BOOKS_API_BASE_URL}/all`);
export const addBook = (formData) => {
  return axios.post(`${BOOKS_API_BASE_URL}/add`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};export const deleteBook = (bookId) => axios.delete(`${BOOKS_API_BASE_URL}/delete/${bookId}`);
export const searchBooks = (title) => {
  return axios.get(`${BOOKS_API_BASE_URL}/search/${title}`).then(response => response.data);
};
export const updateBook = (bookId, updatedData) =>
  axios.put(`${BOOKS_API_BASE_URL}/update/${bookId}`, updatedData);

// Purchase API (Now pointing to "purchases" instead of "books")


export const purchaseBook = async (userId, bookId) => {
  try {
      const response = await axios.post(`${PURCHASES_API_BASE_URL}/buy`, null, {
          params: { userId, bookId }, // ✅ Correct way to send query params
          headers: { "Content-Type": "application/json" }
      });

      console.log("Purchase API Response:", response.data); // ✅ Debugging log

      return response.data; // Ensure this contains updated book data
  } catch (error) {
      console.error("Error purchasing book:", error);
      throw error;
  }
};

export const getPurchaseHistory = async (userId) => {
  try {
      const response = await axios.get(`${PURCHASES_API_BASE_URL}/history/${userId}`);
      return response.data;
  } catch (error) {
      console.error("Error fetching purchase history:", error);
      return [];
  }
};

export const getAllPurchaseHistory = async (page = 0, size = 10) => {
  try {
      const response = await fetch(`${PURCHASES_API_BASE_URL}/purchase-history?page=${page}&size=${size}`);
      if (!response.ok) throw new Error("Failed to fetch history");
      return response.json(); 
  } catch (error) {
      console.error(error);
      return { content: [], totalPages: 0 };
  }
};


export const getBookDocument = (bookId) => {
  return axios.get(`${BOOKS_API_BASE_URL}/doc/${bookId}`, {
    responseType: "blob", // Binary response for documents
  });
};
