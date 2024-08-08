import React from "react";

const Invoice = ({ bookingData }) => {
  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Invoice
          </h1>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Customer Information
              </h2>
              <p>Name: {bookingData.customerName}</p>
              <p>Email: {bookingData.email}</p>
              <p>Contact Number: {bookingData.contactNumber}</p>
              <p>
                Address: {bookingData.firstLineOfAddress}, {bookingData.town},{" "}
                {bookingData.postcode}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Service Details
              </h2>
              <p>Service: {bookingData.selectService}</p>
              <p>Number of Bedrooms: {bookingData.numberOfBedrooms}</p>
              <p>Number of Stories: {bookingData.numberOfStories}</p>
              <p>Date: {bookingData.selectedDate}</p>
              <p>Time Slot: {bookingData.selectedTimeSlot}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Payment Details
              </h2>
              <p>Invoice Number: {bookingData.invoiceNumber}</p>
              <p>Amount: ${bookingData.amount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;

// // src/components/Invoice.jsx
// import React from "react";

// const Invoice = ({ bookingData }) => {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-4">Invoice</h2>
//       <div className="grid grid-cols-2 gap-4">
//         <p>
//           <strong>Invoice Number:</strong> {bookingData.invoiceNumber}
//         </p>
//         <p>
//           <strong>Date:</strong> {new Date().toLocaleDateString()}
//         </p>
//         <p>
//           <strong>Customer:</strong> {bookingData.customerName}
//         </p>
//         <p>
//           <strong>Service:</strong> {bookingData.selectService}
//         </p>
//         <p>
//           <strong>Amount Paid:</strong> £{bookingData.amount}
//         </p>
//       </div>
//       <button
//         onClick={() => window.print()}
//         className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         Print Invoice
//       </button>
//     </div>
//   );
// };

// export default Invoice;
