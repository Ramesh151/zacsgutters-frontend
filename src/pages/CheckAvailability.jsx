// src/pages/CheckAvailability.jsx

import React, { useState } from "react";
import axios from "axios";
import moment from "moment";

const TIME_SLOTS = ["9-10 AM", "10-11 AM", "11-12 AM", "12-1 PM", "1-2 PM"];

const CheckAvailability = () => {
  const [postcode, setPostcode] = useState("");
  const [availability, setAvailability] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/customers/check-availability",
        {
          postcode,
        }
      );
      setAvailability(response.data.data);
      setMessage("");
    } catch (error) {
      setMessage("Error checking availability. Please try again.");
      console.error("Error fetching availability:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Check Availability</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6">
        <div className="mb-4">
          <label htmlFor="postcode" className="block mb-2">
            Postcode
          </label>
          <input
            type="text"
            id="postcode"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Check Availability
        </button>
      </form>

      {availability && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Date</th>
                {TIME_SLOTS.map((slot) => (
                  <th key={slot} className="border px-4 py-2">
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(availability).map(([date, slots]) => (
                <tr key={date}>
                  <td className="border px-4 py-2">{date}</td>
                  {slots.map(({ timeSlot, isBooked }) => (
                    <td
                      key={timeSlot}
                      className={`border px-4 py-2 text-center ${
                        isBooked ? "bg-red-500" : "bg-blue-500"
                      } text-white`}
                    >
                      {timeSlot}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {message && <p className="mt-4 text-red-600 text-center">{message}</p>}
    </div>
  );
};

export default CheckAvailability;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const TIME_SLOTS = ["9-10 AM", "10-11 AM", "11-12 AM", "12-1 PM", "1-2 PM"];

// const CheckAvailability = () => {
//   const [postcode, setPostcode] = useState("");
//   const [date, setDate] = useState("");
//   const [availability, setAvailability] = useState(null);
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:4000/api/customers/check-availability",
//         {
//           date,
//           postcode,
//         }
//       );
//       setAvailability(response.data);
//       setMessage("");
//     } catch (error) {
//       setMessage("Error checking availability. Please try again.");
//       console.error("Error fetching availability:", error);
//     }
//   };

//   const handleTimeSlotClick = (timeSlot) => {
//     if (availability && !availability.bookedTimeSlots.includes(timeSlot)) {
//       navigate("/book-service", {
//         state: { postcode, date, timeSlot },
//       });
//     } else {
//       setMessage("Sorry, this time slot is not available. Please try another.");
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Check Availability</h1>
//       <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6">
//         <div className="mb-4">
//           <label htmlFor="postcode" className="block mb-2">
//             Postcode
//           </label>
//           <input
//             type="text"
//             id="postcode"
//             value={postcode}
//             onChange={(e) => setPostcode(e.target.value)}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="date" className="block mb-2">
//             Date
//           </label>
//           <input
//             type="date"
//             id="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//         >
//           Check Availability
//         </button>
//       </form>

//       {availability && (
//         <div className="max-w-md mx-auto">
//           <h2 className="text-xl font-bold mb-4">Available Time Slots</h2>
//           <div className="grid grid-cols-1 gap-4">
//             {TIME_SLOTS.map((slot) => (
//               <button
//                 key={slot}
//                 onClick={() => handleTimeSlotClick(slot)}
//                 className={`w-full p-2 rounded text-white ${
//                   availability.bookedTimeSlots.includes(slot)
//                     ? "bg-red-500 cursor-not-allowed"
//                     : "bg-green-500 hover:bg-green-700"
//                 }`}
//                 disabled={availability.bookedTimeSlots.includes(slot)}
//               >
//                 {slot}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//       {message && <p className="mt-4 text-red-600 text-center">{message}</p>}
//     </div>
//   );
// };

// export default CheckAvailability;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const CheckAvailability = () => {
//   const [postcode, setPostcode] = useState("");
//   const [date, setDate] = useState("");
//   const [timeSlot, setTimeSlot] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Here you would typically make an API call to check availability
//     // For this example, we'll just simulate a response
//     const isAvailable = Math.random() < 0.7; // 70% chance of being available

//     if (isAvailable) {
//       navigate("/book-service", {
//         state: { postcode, date, timeSlot },
//       });
//     } else {
//       setMessage("Sorry, this time slot is not available. Please try another.");
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Check Availability</h1>
//       <form onSubmit={handleSubmit} className="max-w-md mx-auto">
//         <div className="mb-4">
//           <label htmlFor="postcode" className="block mb-2">
//             Postcode
//           </label>
//           <input
//             type="text"
//             id="postcode"
//             value={postcode}
//             onChange={(e) => setPostcode(e.target.value)}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="date" className="block mb-2">
//             Date
//           </label>
//           <input
//             type="date"
//             id="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="timeSlot" className="block mb-2">
//             Time Slot
//           </label>
//           <select
//             id="timeSlot"
//             value={timeSlot}
//             onChange={(e) => setTimeSlot(e.target.value)}
//             className="w-full p-2 border rounded"
//             required
//           >
//             <option value="">Select a time slot</option>
//             <option value="morning">Morning</option>
//             <option value="afternoon">Afternoon</option>
//             <option value="evening">Evening</option>
//           </select>
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//         >
//           Check Availability
//         </button>
//       </form>
//       {message && <p className="mt-4 text-red-600 text-center">{message}</p>}
//     </div>
//   );
// };

// export default CheckAvailability;

// import React, { useState } from "react";

// const CheckAvailability = () => {
//   const [date, setDate] = useState("");
//   const [timeSlot, setTimeSlot] = useState("");
//   const [postcode, setPostcode] = useState("");
//   const [availability, setAvailability] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleCheckAvailability = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await axios.post("/checkAvailability", {
//         date,
//         timeSlot,
//         postcode,
//       });
//       setAvailability(response.data.available);
//     } catch (error) {
//       console.error("Error checking availability:", error);
//       setAvailability(false);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="bg-gray-100 p-6 rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold mb-4">Check Availability</h2>
//       <form onSubmit={handleCheckAvailability} className="space-y-4">
//         <div>
//           <label
//             htmlFor="date"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Date
//           </label>
//           <input
//             type="date"
//             id="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//             required
//           />
//         </div>
//         <div>
//           <label
//             htmlFor="timeSlot"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Time Slot
//           </label>
//           <select
//             id="timeSlot"
//             value={timeSlot}
//             onChange={(e) => setTimeSlot(e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//             required
//           >
//             <option value="">Select a time slot</option>
//             <option value="morning">Morning</option>
//             <option value="afternoon">Afternoon</option>
//             <option value="evening">Evening</option>
//           </select>
//         </div>
//         <div>
//           <label
//             htmlFor="postcode"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Postcode
//           </label>
//           <input
//             type="text"
//             id="postcode"
//             value={postcode}
//             onChange={(e) => setPostcode(e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//           disabled={loading}
//         >
//           {loading ? "Checking..." : "Check Availability"}
//         </button>
//       </form>
//       {availability !== null && (
//         <p
//           className={`mt-4 text-center font-semibold ${
//             availability ? "text-green-600" : "text-red-600"
//           }`}
//         >
//           {availability
//             ? "Service is available!"
//             : "Service is not available for the selected options."}
//         </p>
//       )}
//     </div>
//   );
// };
// export default CheckAvailability;
