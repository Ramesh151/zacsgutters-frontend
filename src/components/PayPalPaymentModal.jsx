// src/components/PayPalPaymentModal.js
import React, { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalPaymentModal = ({ formData, orderId, onSuccess, onCancel }) => {
  const [isSdkReady, setIsSdkReady] = useState(false);

  useEffect(() => {
    setIsSdkReady(true);
  }, []);

  const handleApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      onSuccess(details);
    });
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>
        {isSdkReady ? (
          <PayPalScriptProvider options={{ "client-id": "YOUR_CLIENT_ID" }}>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: calculatePrice(
                          formData.selectService,
                          formData.numberOfBedrooms,
                          formData.numberOfStories
                        ),
                      },
                    },
                  ],
                });
              }}
              onApprove={handleApprove}
              onCancel={handleCancel}
            />
          </PayPalScriptProvider>
        ) : (
          <div>Loading PayPal...</div>
        )}
        <button
          onClick={handleCancel}
          className="mt-4 py-2 px-4 bg-gray-500 text-white rounded-md shadow-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PayPalPaymentModal;
