import axios from "axios";

const api = axios.create({
  baseURL: "https://zacsgutters.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});
export const createCustomer = async (formData) => {
  try {
    const response = await api.post("/create", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const capturePayment = async (paymentData) => {
  try {
    const response = await api.post("/capture-payment", paymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelPayment = async (bookingId) => {
  try {
    const response = await api.post(`/${bookingId}/cancel`);
    console.log("cancle payment", response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
