import React from "react";

const TimePicker = ({ selectedTimeSlot, setSelectedTimeSlot, error }) => {
  const timeSlots = [
    "9:00-9:45 AM",
    "9:45-10:30 AM",
    "10:30-11:15 AM",
    "11:15-12:00 PM",
    "12:00-12:45 PM",
    "12:45-1:30 PM",
    "1:30-2:15 PM",
    "2:15-3:00 PM",
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Time Slot
      </label>
      <div className="mt-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {timeSlots.map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => setSelectedTimeSlot(slot)}
            className={`p-2 text-sm rounded-md ${
              selectedTimeSlot === slot
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            {slot}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default TimePicker;
