import React, { useState, useEffect } from "react";
import { FaCreditCard, FaSpinner, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import useAxios from "../../../hooks/useAxios";

const MembershipPayment = ({ user, plan, onClose, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosInstance = useAxios();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!user || !plan) return;

    const createPaymentIntent = async () => {
      try {
        const res = await axiosInstance.post("/payments/create-membership-intent", {
          price: plan.price,
          planId: plan._id,
          userId: user._id,
        });
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        toast.error("Failed to initialize payment");
        onClose();
      }
    };
    createPaymentIntent();
  }, [user, plan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);
    try {
      const card = elements.getElement(CardElement);
      if (!card) throw new Error("Card element not found");

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (error) throw error;

      if (paymentIntent.status === "succeeded") {
        // Save payment & activate membership
        await axiosInstance.post("/payments/process", {
          paymentIntentId: paymentIntent.id,
          planId: plan._id,
          userId: user._id,
          amount: plan.price,
        });

        toast.success("Payment successful! Membership activated.");
        onSuccess();
      } else {
        toast.error(`Payment not completed. Status: ${paymentIntent.status}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  if (!plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white shadow-xl dark:bg-gray-800 rounded-xl"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Complete Payment
            </h3>
            <button onClick={onClose} disabled={processing} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <FaTimes />
            </button>
          </div>

          <div className="p-4 mb-6 bg-gray-100 rounded-lg dark:bg-gray-700">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300">Plan:</span>
              <span className="font-medium">{plan.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Amount:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">${plan.price}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <CardElement
                options={{
                  style: {
                    base: { fontSize: "16px", color: "#424770", "::placeholder": { color: "#aab7c4" } },
                    invalid: { color: "#9e2146" },
                  },
                }}
              />
            </div>

            <div className="flex justify-end mt-8 space-x-3">
              <button type="button" onClick={onClose} disabled={processing} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button type="submit" disabled={!stripe || processing} className="flex items-center justify-center px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 min-w-32">
                {processing ? <><FaSpinner className="mr-2 animate-spin" /> Processing...</> : <><FaCreditCard className="mr-2" /> Pay ${plan.price}</>}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default MembershipPayment;
