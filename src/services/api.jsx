// api.js

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true
});

// User Authentication
export const login = (formData) => api.post("/api/users/login", formData);

// Logout
export const logout = () => api.post("/api/users/logout");

// Forget Password
export const forgetPassword = (email) => api.post("/api/users/forget", { email });

// Get Reset Password Token
export const getResetPasswordToken = (token) => api.get(`/api/users/reset-password-token/${token}`);

// Reset Password
export const resetPassword = (passwordDetails) => api.patch("/api/users/reset-password/", passwordDetails);

// Other API Functions
export const checkCustomer = (formData) => api.post("/check", formData);

export const createCustomer = (formData) => api.post("/create", formData);

export const getAllDataBooking = () => api.get("/api/customers");

export const capturePayment = (paymentDetails) => api.post("/capture-payment", paymentDetails);

export const cancelPayment = (bookingId) => api.post(`/${bookingId}/cancel`);







// import axios from "axios";

// const api = axios.create({
//   // baseURL: "https://zacsgutters.onrender.com",
//   baseURL: "http://localhost:4000",
//   withCredentials:true
// });

// // User Authentication
// export const login = async (formData) => {
//   try {
//     const response = await api.post("/api/users/login", formData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// // Logout
// export const logout = async () => {
//   try {
//     const response = await api.post("/api/users/logout");
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// // Forget Password
// export const forgetPassword = async (email) => {
//   try {
//     const response = await api.post("/api/users/forget", { email });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// // Get Reset Password Token
// export const getResetPasswordToken = async (token) => {
//   try {
//     const response = await api.get(`/api/users/reset-password-token/${token}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// // Reset Password
// export const resetPassword = async (passwordDetails) => {
//   try {
//     const response = await api.patch("/api/users/reset-password/", passwordDetails);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// // Other API Functions
// export const checkCustomer = async (formData) => {
//   try {
//     const response = await api.post("/check", formData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const createCustomer = async (formData) => {
//   try {
//     const response = await api.post("/create", formData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
// export const getalldatabooking = async (formData) => {
//   try {
//     const response = await api.get("/api/customers");
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const capturePayment = async (paymentDetails) => {
//   try {
//     const response = await api.post("/capture-payment", paymentDetails);
//     console.log("Payment capture response:", response);
//     return response.data;
//   } catch (error) {
//     console.error("Error capturing payment:", error);
//     throw error;
//   }
// };

// export const cancelPayment = async (bookingId) => {
//   try {
//     const response = await api.post(`/${bookingId}/cancel`);
//     console.log("Cancel payment:", response);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export default api;




// //src/service/api.js
// import axios from "axios";
// const api = axios.create({
//   // baseURL: "https://zacsgutters.onrender.com",
//   baseURL: "http://localhost:4000",
// });
// export const login = async (formData) => {
//   try {
//     const response = await api.post("/api/users/login", formData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
// export const checkCustomer = async (formData) => {
//   try {
//     const response = await api.post("/check", formData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
// export const createCustomer = async (formData) => {
//   try {
//     const response = await api.post("/create", formData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
// export const capturePayment = async (paymentDetails) => {
//   try {
//     // Use POST request to send payment details in the body
//     const response = await api.post("/capture-payment", paymentDetails);
//     console.log("Payment capture response:", response);

//     return response.data;
//   } catch (error) {
//     console.error("Error capturing payment:", error);
//     throw error;
//   }
// };

// export const cancelPayment = async (bookingId) => {
//   try {
//     const response = await api.post(`/${bookingId}/cancel`);
//     console.log("cancle payment", response);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export default api;
