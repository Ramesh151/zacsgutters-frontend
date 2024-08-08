import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { checkCustomer } from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  error,
}) => (
  <div className="relative">
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className={`peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 ${
        error ? "border-red-500" : ""
      }`}
      placeholder={label}
      required={required}
    />
    <label
      htmlFor={name}
      className={`absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm ${
        error
          ? "text-red-500"
          : "text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-gray-600"
      }`}
    >
      {label}
    </label>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  required,
  error,
}) => (
  <div className="relative">
    <select
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className={`peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 appearance-none ${
        error ? "border-red-500" : ""
      }`}
      required={required}
    >
      <option value="" disabled hidden>
        Select {label}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <label
      htmlFor={name}
      className={`absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm ${
        error
          ? "text-red-500"
          : "text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-gray-600"
      }`}
    >
      {label}
    </label>
    <ChevronDownIcon className="absolute right-0 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const INITIAL_FORM_STATE = {
  customerName: "",
  email: "",
  contactNumber: "",
  firstLineOfAddress: "",
  town: "",
  postcode: "",
  selectedDate: null,
  selectedTimeSlot: "",
  selectService: "",
  selectPropertyType: "",
  numberOfBedrooms: "",
  numberOfStories: "",
  howDidYouHearAboutUs: "",
  file: null || [],
  message: "",
  paymentMethod: "",
};

const TIME_SLOT_OPTIONS = [
  { value: "9:00-9:45 AM", label: "9:00-9:45 AM" },
  { value: "9:45-10:30 AM", label: "9:45-10:30 AM" },
  { value: "10:30-11:15 AM", label: "10:30-11:15 AM" },
  { value: "11:15-12:00 PM", label: "11:15-12:00 PM" },
  { value: "12:00-12:45 PM", label: "12:00-12:45 PM" },
  { value: "12:45-1:30 PM", label: "12:45-1:30 PM" },
  { value: "1:30-2:15 PM", label: "1:30-2:15 PM" },
  { value: "2:15-3:00 PM", label: "2:15-3:00 PM" },
];

const SERVICE_OPTIONS = [
  { value: "Gutter Cleaning", label: "Gutter Cleaning" },
  { value: "Gutter Wash Down", label: "Gutter Wash Down" },
  { value: "Gutter Repair", label: "Gutter Repair" },
  { value: "Gutter Replacement", label: "Gutter Replacement" },
  { value: "Soffits and Fascias", label: "Soffits and Fascias" },
];

const PROPERTY_TYPE_OPTIONS = [
  { value: "House Terraced", label: "House Terraced" },
  { value: "House Semi Detached", label: "House Semi Detached" },
  { value: "Bungalow", label: "Bungalow" },
  { value: "Flat", label: "Flat" },
  { value: "Other", label: "Other" },
];

const BEDROOM_OPTIONS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
];

const STORY_OPTIONS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
];

const HEAR_ABOUT_US_OPTIONS = [
  { value: "Search Engine", label: "Search Engine" },
  { value: "Recommendation", label: "Recommendation" },
  { value: "Social Media", label: "Social Media" },
  { value: "Flyers / Marketing", label: "Flyers / Marketing" },
  { value: "Other", label: "Other" },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: "PayPal", label: "PayPal" },
  { value: "Cash", label: "Cash" },
  { value: "Online", label: "Online" },
];

const ServiceBookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Check if there's form data in the location state (i.e., we're editing)
    if (location.state && location.state.formData) {
      setFormData(location.state.formData);
    }
  }, [location.state]);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    },
    [errors]
  );

  const handleDateChange = useCallback(
    (date) => {
      setFormData((prevState) => ({
        ...prevState,
        selectedDate: date,
      }));
      if (errors.selectedDate) {
        setErrors((prevErrors) => ({ ...prevErrors, selectedDate: "" }));
      }
    },
    [errors]
  );

  const handleFileChange = useCallback((e) => {
    setFormData((prevState) => ({
      ...prevState,
      file: e.target.files[0],
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] === "" && key !== "file" && key !== "message") {
        newErrors[key] = "This field is required";
      }
    });
    if (!formData.selectedDate) {
      newErrors.selectedDate = "Please select a date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // const handleSubmit = useCallback(
  //   (e) => {
  //     e.preventDefault();
  //     console.log("from ", formData);

  //     if (validateForm()) {
  //       const response = checkCustomer(formData);
  //       if (response.success) {
  //         navigate("/booking-overview", { state: { formData } });
  //       }
  //     } else {
  //       const firstErrorField = Object.keys(errors)[0];
  //       const errorElement = document.getElementById(firstErrorField);
  //       if (errorElement) {
  //         errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
  //       }
  //     }
  //   },
  //   [formData, errors, navigate, validateForm]
  // );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Log form data for debugging purposes
      console.log("Form Data:", formData);

      // Check if formData is valid
      if (!formData) {
        toast.error("No booking data available.");
        return;
      }

      // Validate form fields
      if (!validateForm()) {
        toast.error("Please correct the form errors before submitting.");
        const firstErrorField = Object.keys(errors)[0];
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      // Perform the API request and handle the response
      try {
        const response = await checkCustomer(formData);

        if (response.success) {
          toast.success("Customer check successful!");
          navigate("/booking-overview", { state: { formData } });
        } else {
          toast.error(
            response.message || "An error occurred while checking the customer."
          );
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error(
          error.response?.data?.message ||
            "An unexpected error occurred. Please try again later."
        );
      }
    },
    [formData, errors, navigate, validateForm]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
            {location.state && location.state.formData
              ? "Edit Your Booking"
              : "Book Your Service"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <InputField
                label="Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                required
                error={errors.customerName}
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                error={errors.email}
              />
              <InputField
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                required
                error={errors.contactNumber}
              />
              <InputField
                label="First Line of Address"
                name="firstLineOfAddress"
                value={formData.firstLineOfAddress}
                onChange={handleInputChange}
                required
                error={errors.firstLineOfAddress}
              />
              <InputField
                label="Town"
                name="town"
                value={formData.town}
                onChange={handleInputChange}
                required
                error={errors.town}
              />
              <InputField
                label="Postcode"
                name="postcode"
                value={formData.postcode}
                onChange={handleInputChange}
                required
                error={errors.postcode}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="relative">
                <DatePicker
                  selected={formData.selectedDate}
                  onChange={handleDateChange}
                  className={`peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 ${
                    errors.selectedDate ? "border-red-500" : ""
                  }`}
                  placeholderText="Select Date"
                  required
                />
                <label
                  className={`absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm ${
                    errors.selectedDate
                      ? "text-red-500"
                      : "text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-gray-600"
                  }`}
                >
                  Date
                </label>
                {errors.selectedDate && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.selectedDate}
                  </p>
                )}
              </div>
              <SelectField
                label="Time Slot"
                name="selectedTimeSlot"
                value={formData.selectedTimeSlot}
                onChange={handleInputChange}
                options={TIME_SLOT_OPTIONS}
                required
                error={errors.selectedTimeSlot}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <SelectField
                label="Service"
                name="selectService"
                value={formData.selectService}
                onChange={handleInputChange}
                options={SERVICE_OPTIONS}
                required
                error={errors.selectService}
              />
              <SelectField
                label="Property Type"
                name="selectPropertyType"
                value={formData.selectPropertyType}
                onChange={handleInputChange}
                options={PROPERTY_TYPE_OPTIONS}
                required
                error={errors.selectPropertyType}
              />
              <SelectField
                label="Number of Bedrooms"
                name="numberOfBedrooms"
                value={formData.numberOfBedrooms}
                onChange={handleInputChange}
                options={BEDROOM_OPTIONS}
                required
                error={errors.numberOfBedrooms}
              />
              <SelectField
                label="Number of Stories"
                name="numberOfStories"
                value={formData.numberOfStories}
                onChange={handleInputChange}
                options={STORY_OPTIONS}
                required
                error={errors.numberOfStories}
              />
            </div>
            <SelectField
              label="How did you hear about us?"
              name="howDidYouHearAboutUs"
              value={formData.howDidYouHearAboutUs}
              onChange={handleInputChange}
              options={HEAR_ABOUT_US_OPTIONS}
              required
              error={errors.howDidYouHearAboutUs}
            />
            <div>
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Upload File (optional)
              </label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Additional Information (optional)
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
              />
            </div>
            <SelectField
              label="Payment Method"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              options={[
                { value: "PayPal", label: "PayPal" },
                { value: "Cash", label: "Cash" },
                { value: "Online", label: "Online" },
              ]}
              required
            />
            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {location.state && location.state.formData
                  ? "Update Booking"
                  : "Review Booking"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default ServiceBookingForm;
