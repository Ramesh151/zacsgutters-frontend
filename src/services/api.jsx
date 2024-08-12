//src/service/api.js
import axios from "axios";
const api = axios.create({
  // baseURL: "https://zacsgutters.onrender.com",
  baseURL: "http://localhost:4000",
});
export const checkCustomer = async (formData) => {
  try {
    const response = await api.post("/check", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createCustomer = async (formData) => {
  try {
    const response = await api.post("/create", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const capturePayment = async (token, PayerID) => {
//   try {
//     // const response = await api.get("/capture-payment", paymentData);
//     const response = await api.get(`/return?token=${token}&PayerID=${PayerID}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
// export const capturePayment = async (paymentDetails) => {
//   try {
//     // const response = await api.get("/capture-payment", paymentData);
//     const response = await api.get(`/return`{});
//     console.log("dekta hai ", response);

//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const capturePayment = async (paymentDetails) => {
  try {
    // Use POST request to send payment details in the body
    const response = await api.post("/capture-payment", paymentDetails);
    console.log("Payment capture response:", response);

    return response.data;
  } catch (error) {
    console.error("Error capturing payment:", error);
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
