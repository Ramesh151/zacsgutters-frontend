// // src/pages/PayPalReturn.jsx

// src/pages/PayPalReturn.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { capturePayment } from "../services/api"; // Ensure this service is correctly implemented

const PayPalReturn = () => {
  const [status, setStatus] = useState("processing");
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmPayment = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get("token");
      const PayerID = searchParams.get("PayerID");

      if (!token || !PayerID) {
        setStatus("error");
        setError("Payment information is missing. Please try again.");
        return;
      }

      try {
        const result = await capturePayment(token, PayerID);
        if (result.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setError(
            result.message ||
              "Unable to confirm payment. Please contact support."
          );
        }
      } catch (err) {
        setStatus("error");
        setError(
          "An unexpected error occurred while confirming the payment. Please try again later."
        );
      }
    };

    confirmPayment();
  }, [location, navigate]);

  const handleContinue = () => {
    if (status === "success") {
      navigate("/confirmation");
    } else {
      navigate("/booking-cancelled");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Payment Status</h1>

        {status === "processing" && (
          <div className="text-center">
            <p className="mb-4">Processing your payment...</p>
            <div className="loader mt-4">
              {" "}
              {/* Assuming .loader is styled elsewhere */}{" "}
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <p className="text-green-600 font-semibold mb-4">
              Payment Successful!
            </p>
            <p>Your booking has been confirmed. Thank you for your purchase.</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <p className="text-red-600 font-semibold mb-4">Payment Failed</p>
            <p>{error}</p>
          </div>
        )}

        <button
          onClick={handleContinue}
          className="w-full mt-6 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
        >
          {status === "success" ? "View Confirmation" : "Return to Booking"}
        </button>
      </div>
    </div>
  );
};

export default PayPalReturn;

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { capturePayment } from "../services/api"; // You'll need to create this API service

// const PayPalReturn = () => {
//   const [status, setStatus] = useState("processing");
//   const [error, setError] = useState(null);
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const confirmPayment = async () => {
//       const searchParams = new URLSearchParams(location.search);
//       const token = searchParams.get("token");
//       const PayerID = searchParams.get("PayerID");

//       if (!token || !PayerID) {
//         setStatus("error");
//         setError("Missing payment information");
//         return;
//       }

//       try {
//         const result = await capturePayment(token, PayerID);
//         console.log("result  cap", result);
//         if (result.success) {
//           setStatus("success");
//         } else {
//           setStatus("error");
//           setError(result.message || "Payment confirmation failed");
//         }
//       } catch (err) {
//         setStatus("error");
//         setError("An error occurred while confirming the payment");
//       }
//     };

//     confirmPayment();
//   }, [location]);

//   const handleContinue = () => {
//     if (status === "success") {
//       navigate("/confirmation");
//     } else {
//       navigate("/booking-cancelled");
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
//         <h1 className="text-2xl font-bold mb-4 text-center">Payment Status</h1>

//         {status === "processing" && (
//           <div className="text-center">
//             <p>Processing your payment...</p>
//             <div className="loader mt-4"></div>
//           </div>
//         )}

//         {status === "success" && (
//           <div className="text-center">
//             <p className="text-green-600 font-semibold mb-4">
//               Payment successful!
//             </p>
//             <p>Your booking has been confirmed.</p>
//           </div>
//         )}

//         {status === "error" && (
//           <div className="text-center">
//             <p className="text-red-600 font-semibold mb-4">Payment failed</p>
//             <p>{error}</p>
//           </div>
//         )}

//         <button
//           onClick={handleContinue}
//           className="w-full mt-6 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//         >
//           {status === "success" ? "View Confirmation" : "Return to Booking"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PayPalReturn;
