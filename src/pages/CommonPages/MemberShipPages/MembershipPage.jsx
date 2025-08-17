import React, { useState, useEffect } from "react";
import { FaCheck, FaSpinner, FaArrowRight, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import MembershipPayment from "./MembershipPayment";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const MembershipPage = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get("/admin/membership-plans");
      const plansData = Array.isArray(res.data) ? res.data : [res.data];
      setPlans(plansData.filter((plan) => plan.active));
    } catch (err) {
      toast.error("Failed to load plans");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handlePlanSelect = (plan) => {
    if (!user) {
      navigate("/login", { state: { from: "/membership" } });
      return;
    }
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="text-4xl animate-spin" style={{ color: "var(--color-accent)" }} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-12"
      style={{
        // background: "var(--color-background)",
        color: "var(--color-text-primary)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold" style={{ color: "var(--color-primary)" }}>
            Choose Your Membership
          </h1>
          <p className="mt-4 text-lg" style={{ color: "var(--color-text-secondary)" }}>
            Select the plan that best fits your needs
          </p>
        </div>

        {/* Plans */}
        {plans.length === 0 ? (
          <div className="py-12 text-center">
            <p style={{ color: "var(--color-text-secondary)" }}>No membership plans available.</p>
            <button
              onClick={fetchPlans}
              className="px-6 py-2 mt-4 transition-colors rounded-lg shadow-md"
              style={{
                background: "var(--color-primary)",
                color: "#fff",
              }}
            >
              Refresh Plans
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <motion.div
                key={plan._id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden shadow-lg rounded-2xl backdrop-blur-md"
                style={{
                  background: "var(--color-surface)",
                  border: plan.isFeatured
                    ? `2px solid var(--color-accent)`
                    : "1px solid rgba(0,0,0,0.05)",
                }}
              >
                {/* Featured Tag */}
                {plan.isFeatured && (
                  <div
                    className="flex items-center justify-center gap-2 py-2 text-sm font-bold"
                    style={{ background: "var(--color-accent)", color: "#fff" }}
                  >
                    <FaStar /> MOST POPULAR
                  </div>
                )}

                {/* Card Content */}
                <div className="p-8">
                  <h3
                    className="mb-2 text-2xl font-bold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {plan.name}
                  </h3>
                  <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-end gap-2 mb-6">
                    <span
                      className="text-4xl font-extrabold"
                      style={{ color: "var(--color-primary)" }}
                    >
                      ${plan.price}
                    </span>
                    <span style={{ color: "var(--color-text-secondary)" }}>
                      /{plan.duration}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start">
                        <FaCheck className="flex-shrink-0 mt-1 mr-2" style={{ color: "var(--color-success)" }} />
                        <span style={{ color: "var(--color-text-primary)" }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => handlePlanSelect(plan)}
                    className="flex items-center justify-center w-full px-6 py-3 font-semibold transition-transform shadow-md rounded-xl hover:scale-105"
                    style={{
                      background: plan.isFeatured
                        ? "var(--color-accent)"
                        : "var(--color-secondary)",
                      color: "#fff",
                    }}
                  >
                    {user ? "Get Started" : "Sign Up"}
                    <FaArrowRight className="ml-2" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <MembershipPayment
          user={user}
          plan={selectedPlan}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default function MembershipPageWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <MembershipPage />
    </Elements>
  );
}
