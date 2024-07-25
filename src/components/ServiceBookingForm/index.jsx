import React, { useState } from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import PayPalPaymentForm from "../PayPalPaymentForm/index";
import {
  createCustomer,
  cancelPayment,
  capturePayment,
} from "../../services/api";
import { validateForm } from "../../utils/validation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const PayPalPaymentModal = ({ approvalUrl, orderId, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Complete Your PayPal Payment
          </h2>
          <p className="mb-6 text-center text-gray-600">
            Click the button below to proceed with your PayPal payment.
          </p>
          <div className="mb-6 flex justify-center">
            <a
              href={approvalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Pay with PayPal
            </a>
          </div>
          <div className="flex justify-center">
            <button
              onClick={onCancel}
              className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Cancel Payment
            </button>
          </div>
        </div>
        <div className="bg-gray-100 px-6 py-4">
          <p className="text-sm text-gray-600 text-center">
            Order ID: <span className="font-mono">{orderId}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const ServiceBookingForm = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    contactNumber: "",
    firstLineOfAddress: "",
    town: "",
    postcode: "",
    selectedDate: "",
    selectedTimeSlot: "",
    selectService: "",
    numberOfBedrooms: "",
    numberOfStories: "",
    howDidYouHearAboutUs: "",
    file: null,
    message: "",
    paymentMethod: "",
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [paypalData, setPaypalData] = useState(null);
  // const [loading, setLoading] = useState(false);
  console.log("paypal dat", paypalData);
  const navigate = useNavigate();
  // const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      file: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await createCustomer(formData);
        if (response.success) {
          const { approvalUrl, paypalOrderId, customer } = response.data;

          if (formData.paymentMethod === "PayPal" && approvalUrl) {
            setPaypalData({
              approvalUrl,
              orderId: paypalOrderId,
              customerId: customer._id,
            });
          } else {
            toast.success(response.message);
            navigate("/confirmation", { state: { booking: response.data } });
          }
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error(
          error.response?.data?.message ||
            "An error occurred. Please try again later."
        );
      } finally {
        // setLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handlePayPalCancel = async () => {
    try {
      // await cancelPayment(paypalData.orderId, paypalData.customerId);
      const bookingId = paypalData.customerId;
      await cancelPayment(bookingId);
      toast.info("Payment cancelled");
      setPaypalData(null);
      navigate("/booking-cancelled");
    } catch (error) {
      console.error("Error cancelling payment:", error);
      toast.error("Failed to cancel payment. Please try again.");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const validationErrors = validateForm(formData);
  //   if (Object.keys(validationErrors).length === 0) {
  //     try {
  //       const response = await createCustomer(formData);
  //       if (response.success) {
  //         const { approvalUrl, paypalOrderId, customer } = response.data;

  //         if (approvalUrl) {
  //           // Open PayPal in a new window
  //           const paypalWindow = window.open(approvalUrl, "_blank");

  //           // Set up a listener for when the PayPal window closes
  //           const checkPaypalWindow = setInterval(() => {
  //             if (paypalWindow.closed) {
  //               clearInterval(checkPaypalWindow);
  //               handlePayPalReturn(paypalOrderId, customer._id);
  //             }
  //           }, 500);
  //         }
  //         // toast.success(response?.message);
  //         // // Reset form or redirect to confirmation page
  //         // if (response.data.approvalUrl) {
  //         //   window.location.href = response.data.approvalUrl;
  //         // }
  //       } else {
  //         // toast.error("Failed to create booking. Please try again.");
  //         toast.error(response?.message);
  //       }
  //     } catch (error) {
  //       // toast.error("An error occurred. Please try again later.");
  //       console.log("error", error);
  //       toast.error(error.response?.data?.message);
  //     }
  //   } else {
  //     setErrors(validationErrors);
  //   }
  // };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Book a Service
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              error={errors.customerName}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
            />
            <InputField
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              error={errors.contactNumber}
            />
            <InputField
              label="Address"
              name="firstLineOfAddress"
              value={formData.firstLineOfAddress}
              onChange={handleInputChange}
              error={errors.firstLineOfAddress}
            />
            <InputField
              label="Town"
              name="town"
              value={formData.town}
              onChange={handleInputChange}
              error={errors.town}
            />
            <InputField
              label="Postcode"
              name="postcode"
              value={formData.postcode}
              onChange={handleInputChange}
              error={errors.postcode}
            />
            <DatePicker
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              selectedDate={formData.selectedDate}
              setSelectedDate={(date) =>
                setFormData((prev) => ({ ...prev, selectedDate: date }))
              }
              error={errors.selectedDate}
            />
            <TimePicker
              selectedTimeSlot={formData.selectedTimeSlot}
              setSelectedTimeSlot={(time) =>
                setFormData((prev) => ({ ...prev, selectedTimeSlot: time }))
              }
              error={errors.selectedTimeSlot}
            />
            <SelectField
              label="Service"
              name="selectService"
              value={formData.selectService}
              onChange={handleInputChange}
              options={[
                { value: "Gutter Cleaning", label: "Gutter Cleaning" },
                { value: "Gutter Wash Down", label: "Gutter Wash Down" },
                { value: "Gutter Repair", label: "Gutter Repair" },
                { value: "Gutter Replacement", label: "Gutter Replacement" },
                { value: "Soffits and Fascias", label: "Soffits and Fascias" },
              ]}
              error={errors.selectService}
            />
            <SelectField
              label="Number of Bedrooms"
              name="numberOfBedrooms"
              value={formData.numberOfBedrooms}
              onChange={handleInputChange}
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4", label: "4" },
                { value: "5", label: "5" },
                { value: "6+", label: "6+" },
              ]}
              error={errors.numberOfBedrooms}
            />
            <SelectField
              label="Number of Stories"
              name="numberOfStories"
              value={formData.numberOfStories}
              onChange={handleInputChange}
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4", label: "4" },
              ]}
              error={errors.numberOfStories}
            />
            <SelectField
              label="How did you hear about us?"
              name="howDidYouHearAboutUs"
              value={formData.howDidYouHearAboutUs}
              onChange={handleInputChange}
              options={[
                { value: "Search Engine", label: "Search Engine" },
                { value: "Recommendation", label: "Recommendation" },
                { value: "Social Media", label: "Social Media" },
                { value: "Flyers / Marketing", label: "Flyers / Marketing" },
                { value: "Other", label: "Other" },
              ]}
              error={errors.howDidYouHearAboutUs}
            />
            <div>
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700"
              >
                File (optional)
              </label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:text-sm file:font-semibold
                           file:bg-blue-50 file:text-blue-700
                           hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message (optional)
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <SelectField
              label="Payment Method"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              options={[
                { value: "PayPal", label: "PayPal" },
                { value: "cash", label: "Cash" },
              ]}
              error={errors.paymentMethod}
            />
            {/* {formData.paymentMethod === "PayPal" && (
              <PayPalPaymentForm formData={formData} />
            )} */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Book Now
              </button>
              {/* <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? "Processing..." : "Book Service"},
              </button> */}
            </div>
          </form>
        </div>
      </div>
      {paypalData && (
        <PayPalPaymentModal
          approvalUrl={paypalData.approvalUrl}
          orderId={paypalData.orderId}
          onCancel={handlePayPalCancel}
        />
      )}
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default ServiceBookingForm;
