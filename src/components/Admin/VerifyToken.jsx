// // VerifyToken.js
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// export default function VerifyToken() {
//   const [isValid, setIsValid] = useState(null);
//   const navigate = useNavigate();
//   const { token } = useParams();

//   useEffect(() => {
//     const verifyToken = async () => {
//       try {
//         // In a real application, you would make an API call here to verify the token
//         // For this example, we'll simulate an API call
//         await new Promise((resolve) => setTimeout(resolve, 1000));

//         // Simulate token verification (in reality, this would be done server-side)
//         const isTokenValid = token && token.length === 32; // Just a simple check for demo purposes

//         setIsValid(isTokenValid);

//         if (isTokenValid) {
//           // If token is valid, redirect to reset password page
//           navigate(`/reset-password/${token}`);
//         }
//       } catch (error) {
//         setIsValid(false);
//       }
//     };

//     verifyToken();
//   }, [token, navigate]);

//   if (isValid === null) {
//     return <div>Verifying...</div>;
//   }

//   if (isValid === false) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full space-y-8">
//           <div>
//             <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//               Invalid or Expired Token
//             </h2>
//             <p className="mt-2 text-center text-sm text-gray-600">
//               The password reset link is invalid or has expired. Please request
//               a new one.
//             </p>
//           </div>
//           <div className="text-center">
//             <button
//               onClick={() => navigate("/forgot-password")}
//               className="text-indigo-600 hover:text-indigo-500"
//             >
//               Request a new password reset link
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return null; // This will not be rendered as we redirect on valid token
// }

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function VerifyToken() {
  const [isValid, setIsValid] = useState(null);
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Simulate token verification
        const isTokenValid = token && token.length === 32;

        setIsValid(isTokenValid);

        if (isTokenValid) {
          setTimeout(() => navigate(`/reset-password/${token}`), 1000);
        }
      } catch (error) {
        setIsValid(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-2xl w-96 text-center"
      >
        {isValid === null && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full mx-auto"
          ></motion.div>
        )}
        {isValid === true && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <svg
              className="w-16 h-16 text-green-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <h2 className="text-2xl font-bold mt-4 text-gray-800">
              Token Verified!
            </h2>
            <p className="mt-2 text-gray-600">
              Redirecting to reset password...
            </p>
          </motion.div>
        )}
        {isValid === false && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <svg
              className="w-16 h-16 text-red-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
            <h2 className="text-2xl font-bold mt-4 text-gray-800">
              Invalid Token
            </h2>
            <p className="mt-2 text-gray-600">
              The token is invalid or has expired.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/forgot-password")}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Request New Link
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
