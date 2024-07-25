import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DatePicker = ({
  currentDate,
  setCurrentDate,
  selectedDate,
  setSelectedDate,
  error,
}) => {
  const formatDate = (date) => {
    const options = { weekday: "short", day: "numeric", month: "short" };
    return date.toLocaleDateString(undefined, options);
  };

  const renderDates = () => {
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Date</label>
      <div className="mt-1 flex items-center space-x-2">
        <button
          type="button"
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.setDate(currentDate.getDate() - 1))
            )
          }
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex-1 grid grid-cols-5 gap-2">
          {renderDates().map((date) => (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => setSelectedDate(date.toISOString().split("T")[0])}
              className={`p-2 text-sm rounded-md ${
                selectedDate === date.toISOString().split("T")[0]
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.setDate(currentDate.getDate() + 1))
            )
          }
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default DatePicker;
