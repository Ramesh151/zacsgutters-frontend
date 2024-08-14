import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
  PencilIcon,
} from "lucide-react";
import { createCustomer, cancelPayment, capturePayment } from "../services/api";


const PAYPAL_CLIENT_ID =
  "AT9KqWFK0PICuNSj58vl_HrKE_fKwJOzk7j9c0d37e8jfN9AwCYCM5rCWjbBYJ5Yne-48CpTFvBfAK5Y";

const steps = ["Review Details", "Confirm Booking", "Payment", "Confirmation"];

const BookingOverview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || {};
  console.log("FORM DATA BOOK OVERVIU", formData);

  const [currentStep, setCurrentStep] = useState(0);
  const [paypalOrderId, setPaypalOrderId] = useState(null);
  const [confirmationData, setConfirmationData] = useState(null);
  const [orderCreated, setOrderCreated] = useState(false);

  const handleNext = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));

  const handlePrev = useCallback(async () => {
    if (currentStep === 2 && orderCreated) {
      try {
        await cancelPayment(paypalOrderId);
        toast.info("Order cancelled to niche wla btn");
        setOrderCreated(false);
        setPaypalOrderId(null);
        setCurrentStep(1);
      } catch (error) {
        console.error("Error cancelling order:", error);
        toast.error(
          "There was an error cancelling your order. Please try again."
        );
        return;
      }
    }
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, [currentStep, orderCreated, paypalOrderId]);

  // const handleEdit = () => navigate(-1);

  const handleEdit = () => {
    navigate("/booking-service", { state: { formData } });
  };

  const handleConfirmBooking = useCallback(async () => {
    if (!formData) {
      toast.error("No booking data available.");
      return;
    }
    try {
      const response = await createCustomer(formData);
      if (response.success) {
        const { paypalOrderId, customer } = response.data;
        setPaypalOrderId(paypalOrderId);
        setOrderCreated(true);
        handleNext();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    }
  }, [formData]);

  const handlePaymentSuccess = useCallback(
    async (paymentDetails) => {
      console.log("paymentgg", paymentDetails);

      try {
        const response = await capturePayment(paymentDetails);
        console.log("Payment capture response:", response);
        setConfirmationData({
          ...formData,
          invoiceNumber: paymentDetails.id,
          amount: paymentDetails.purchase_units[0].amount.value,
        });
        handleNext();
        toast.success("Payment successful! Thank you for your booking.");
      } catch (error) {
        console.error("Error capturing payment:", error);
        toast.error(
          "There was an error capturing your payment. Please try again."
        );
      }
    },
    [formData]
  );

  const handlePayPalCancel = useCallback(async () => {
    try {
      await cancelPayment(paypalOrderId);
      toast.info("Order cancelled to niche wla btn");
      setOrderCreated(false);
      setPaypalOrderId(null);
      setCurrentStep(1);
    } catch (error) {
      console.error("Error cancelling payment:", error?.response);
      toast.error(
        error.response?.data?.message ||
          "There was an error cancelling your payment. Please try again."
      );
    }
  }, [paypalOrderId]);

  const formatDate = (date) => {
    return date instanceof Date ? date.toLocaleDateString() : date;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handleEdit}
                className="flex items-center py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
              >
                <PencilIcon className="w-5 h-5 mr-2" />
                Edit Details
              </button>
              <button
                onClick={handleNext}
                className="flex items-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              >
                Next
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </button>
            </div>
            <Section title="Customer Information">
              <p>Name: {formData.customerName}</p>
              <p>Email: {formData.email}</p>
              <p>Contact Number: {formData.contactNumber}</p>
              <p>
                Address: {formData.firstLineOfAddress}, {formData.town},{" "}
                {formData.postcode}
              </p>
            </Section>
            <Section title="Service Details">
              <p>Service: {formData.selectService}</p>
              <p>Home Type: {formData.selectHomeType}</p>
              <p>Home Style: {formData.selectHomeStyle}</p>
              <p>Date: {formatDate(new Date(formData.selectedDate))}</p>
              <p>Time Slot: {formData.selectedTimeSlot}</p>
              <p className="font-bold">Price: ${formData.totalPrice}</p>
            </Section>
            <Section title="Additional Information">
              {/* <p>How did you hear about us: {formData.howDidYouHearAboutUs}</p> */}
              {formData.message && <p>Message: {formData.message}</p>}
              {/* {formData.file && <p>File: {formData.file.name}</p>} */}
            </Section>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-center">
              {orderCreated ? "Booking Confirmed" : "Confirm Your Booking"}
            </h2>
            <p className="text-center">
              {orderCreated
                ? "Your booking has been confirmed. Proceed to payment or go back to make changes."
                : "Please review your booking details one last time before proceeding to payment."}
            </p>
            {!orderCreated && (
              <button
                onClick={handleConfirmBooking}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              >
                Confirm and Proceed to Payment
              </button>
            )}
            {orderCreated && (
              <button
                onClick={handleNext}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              >
                Proceed to Payment
              </button>
            )}
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-center">
              Complete Your Payment
            </h2>
            <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID }}>
              <PayPalButtons
                style={{
                  layout: "horizontal",
                  color: "blue",
                  shape: "pill",
                  label: "pay",
                }}
                fundingSource="paypal"
                createOrder={() => paypalOrderId}
                onApprove={async (data, actions) => {
                  const details = await actions.order.capture();
                  {
                    console.log("deatails nn", details);
                  }
                  handlePaymentSuccess(details);
                }}
                onCancel={handlePayPalCancel}
              />
            </PayPalScriptProvider>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6 text-center"
          >
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
            <p>
              Thank you for your booking. Your invoice number is:{" "}
              {confirmationData?.invoiceNumber}
            </p>
            <p>Total Amount Paid: ${confirmationData?.amount}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              Return to Home
            </button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Booking Overview
          </h1>

          <div className="mb-8">
            <ol className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4">
              {steps.map((step, index) => (
                <li
                  key={step}
                  className={`flex items-center ${
                    index <= currentStep
                      ? "text-blue-600 dark:text-blue-500"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-5 h-5 mr-2 text-xs border ${
                      index <= currentStep
                        ? "border-blue-600 dark:border-blue-500"
                        : "border-gray-500 dark:border-gray-400"
                    } rounded-full shrink-0`}
                  >
                    {index + 1}
                  </span>
                  {step}
                  {index < steps.length - 1 && (
                    <svg
                      className="w-3 h-3 ml-2 sm:ml-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 12 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 5 4 4 6-8"
                      />
                    </svg>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

          <div className="mt-8 flex justify-between">
            {currentStep > 0 && currentStep < 3 && (
              <button
                onClick={handlePrev}
                className="flex items-center py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
              >
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                {currentStep === 2 && orderCreated
                  ? "Cancel Order"
                  : "Previous"}
              </button>
            )}
            {currentStep === 1 && orderCreated && (
              <button
                onClick={handleNext}
                className="flex items-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              >
                Proceed to Payment
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

const Section = ({ title, children }) => (
  <section className="bg-gray-50 p-4 rounded-lg shadow">
    <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
    <div className="space-y-2 text-gray-600">{children}</div>
  </section>
);

export default BookingOverview;

// import React, { useState, useCallback } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   ChevronRightIcon,
//   ChevronLeftIcon,
//   CheckCircleIcon,
//   PencilIcon,
// } from "lucide-react";
// import { createCustomer, cancelPayment, capturePayment } from "../services/api";

// const PAYPAL_CLIENT_ID =
//   "AT9KqWFK0PICuNSj58vl_HrKE_fKwJOzk7j9c0d37e8jfN9AwCYCM5rCWjbBYJ5Yne-48CpTFvBfAK5Y";

// const steps = ["Review Details", "Confirm Booking", "Payment", "Confirmation"];

// const BookingOverview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { formData } = location.state || {};
//   console.log("FORM DATA BOOK OVERVIU", formData);

//   const [currentStep, setCurrentStep] = useState(0);
//   const [paypalOrderId, setPaypalOrderId] = useState(null);
//   const [confirmationData, setConfirmationData] = useState(null);

//   const handleNext = () =>
//     setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
//   const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
//   // const handleEdit = () => navigate(-1);
//   const handleEdit = () => {
//     navigate("/booking-service", { state: { formData } });
//   };
//   const handleConfirmBooking = useCallback(async () => {
//     if (!formData) {
//       toast.error("No booking data available.");
//       return;
//     }
//     try {
//       const response = await createCustomer(formData);
//       if (response.success) {
//         const { paypalOrderId, customer } = response.data;
//         setPaypalOrderId(paypalOrderId);
//         handleNext();
//       } else {
//         toast.error(response.message);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error(
//         error.response?.data?.message ||
//           "An error occurred. Please try again later."
//       );
//     }
//   }, [formData]);

//   const handlePaymentSuccess = useCallback(
//     async (paymentDetails) => {
//       console.log("paymentgg", paymentDetails);

//       try {
//         const response = await capturePayment(paymentDetails);
//         console.log("Payment capture response:", response);
//         setConfirmationData({
//           ...formData,
//           invoiceNumber: paymentDetails.id,
//           amount: paymentDetails.purchase_units[0].amount.value,
//         });
//         handleNext();
//         toast.success("Payment successful! Thank you for your booking.");
//       } catch (error) {
//         console.error("Error capturing payment:", error);
//         toast.error(
//           "There was an error capturing your payment. Please try again."
//         );
//       }
//     },
//     [formData]
//   );

//   const handlePayPalCancel = useCallback(async () => {
//     try {
//       await cancelPayment(paypalOrderId);
//       toast.info("Payment cancelled");
//       setCurrentStep(1);
//     } catch (error) {
//       console.error("Error cancelling payment:", error);
//       toast.error(
//         "There was an error cancelling your payment. Please try again."
//       );
//     }
//   }, [paypalOrderId]);

//   const formatDate = (date) => {
//     return date instanceof Date ? date.toLocaleDateString() : date;
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 0:
//         return (
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -50 }}
//             className="space-y-6"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <button
//                 onClick={handleEdit}
//                 className="flex items-center py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
//               >
//                 <PencilIcon className="w-5 h-5 mr-2" />
//                 Edit Details
//               </button>
//               <button
//                 onClick={handleNext}
//                 className="flex items-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
//               >
//                 Next
//                 <ChevronRightIcon className="w-5 h-5 ml-2" />
//               </button>
//             </div>
//             <Section title="Customer Information">
//               <p>Name: {formData.customerName}</p>
//               <p>Email: {formData.email}</p>
//               <p>Contact Number: {formData.contactNumber}</p>
//               <p>
//                 Address: {formData.firstLineOfAddress}, {formData.town},{" "}
//                 {formData.postcode}
//               </p>
//             </Section>
//             <Section title="Service Details">
//               <p>Service: {formData.selectService}</p>
//               <p>Number of Bedrooms: {formData.numberOfBedrooms}</p>
//               <p>Number of Stories: {formData.numberOfStories}</p>
//               <p>Date: {formatDate(new Date(formData.selectedDate))}</p>
//               <p>Time Slot: {formData.selectedTimeSlot}</p>
//               <p className="font-bold">Price: ${formData.totalPrice}</p>
//             </Section>
//             <Section title="Additional Information">
//               {/* <p>How did you hear about us: {formData.howDidYouHearAboutUs}</p> */}
//               {formData.message && <p>Message: {formData.message}</p>}
//               {/* {formData.file && <p>File: {formData.file.name}</p>} */}
//             </Section>
//           </motion.div>
//         );
//       case 1:
//         return (
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -50 }}
//             className="space-y-6"
//           >
//             <h2 className="text-2xl font-bold text-center">
//               Confirm Your Booking
//             </h2>
//             <p className="text-center">
//               Please review your booking details one last time before proceeding
//               to payment.
//             </p>
//             <button
//               onClick={handleConfirmBooking}
//               className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
//             >
//               Confirm and Proceed to Payment
//             </button>
//           </motion.div>
//         );
//       case 2:
//         return (
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -50 }}
//             className="space-y-6"
//           >
//             <h2 className="text-2xl font-bold text-center">
//               Complete Your Payment
//             </h2>
//             <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID }}>
//               <PayPalButtons
//                 style={{
//                   layout: "horizontal",
//                   color: "blue",
//                   shape: "pill",
//                   label: "pay",
//                 }}
//                 fundingSource="paypal"
//                 createOrder={() => paypalOrderId}
//                 onApprove={async (data, actions) => {
//                   const details = await actions.order.capture();
//                   {
//                     console.log("deatails nn", details);
//                   }
//                   handlePaymentSuccess(details);
//                 }}
//                 onCancel={handlePayPalCancel}
//               />
//             </PayPalScriptProvider>
//           </motion.div>
//         );
//       case 3:
//         return (
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -50 }}
//             className="space-y-6 text-center"
//           >
//             <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
//             <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
//             <p>
//               Thank you for your booking. Your invoice number is:{" "}
//               {confirmationData?.invoiceNumber}
//             </p>
//             <p>Total Amount Paid: ${confirmationData?.amount}</p>
//             <button
//               onClick={() => navigate("/")}
//               className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
//             >
//               Return to Home
//             </button>
//           </motion.div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
//         <div className="px-4 py-5 sm:p-6">
//           <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
//             Booking Overview
//           </h1>

//           <div className="mb-8">
//             <ol className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4">
//               {steps.map((step, index) => (
//                 <li
//                   key={step}
//                   className={`flex items-center ${
//                     index <= currentStep
//                       ? "text-blue-600 dark:text-blue-500"
//                       : "text-gray-500 dark:text-gray-400"
//                   }`}
//                 >
//                   <span
//                     className={`flex items-center justify-center w-5 h-5 mr-2 text-xs border ${
//                       index <= currentStep
//                         ? "border-blue-600 dark:border-blue-500"
//                         : "border-gray-500 dark:border-gray-400"
//                     } rounded-full shrink-0`}
//                   >
//                     {index + 1}
//                   </span>
//                   {step}
//                   {index < steps.length - 1 && (
//                     <svg
//                       className="w-3 h-3 ml-2 sm:ml-4"
//                       aria-hidden="true"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 12 10"
//                     >
//                       <path
//                         stroke="currentColor"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="m1 5 4 4 6-8"
//                       />
//                     </svg>
//                   )}
//                 </li>
//               ))}
//             </ol>
//           </div>

//           <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

//           <div className="mt-8 flex justify-between">
//             {currentStep > 0 && currentStep < 3 && (
//               <button
//                 onClick={handlePrev}
//                 className="flex items-center py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
//               >
//                 <ChevronLeftIcon className="w-5 h-5 mr-2" />
//                 Previous
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//       <ToastContainer position="top-right" autoClose={5000} />
//     </div>
//   );
// };

// const Section = ({ title, children }) => (
//   <section className="bg-gray-50 p-4 rounded-lg shadow">
//     <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
//     <div className="space-y-2 text-gray-600">{children}</div>
//   </section>
// );

// export default BookingOverview;
