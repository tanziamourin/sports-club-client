import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Promotions = () => {
  const axiosSecure = useAxiosSecure();

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/coupons");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <p className="mt-10 text-center text-[var(--color-text-secondary)]">
        Loading coupons...
      </p>
    );

  return (
    <div className="px-4 py-12 mx-auto mt-20 max-w-7xl">
      <h2
        className="mb-5 space-y-5 text-4xl font-bold text-center lg:text-5xl md:text-4xl"
        style={{ color: "var(--color-primary)" }}
      >
        Promotions & Discounts
      </h2>

      <hr className="w-16 h-1 mx-auto mt-3 mb-4 bg-[var(--color-secondary)] rounded" />

      {coupons.length === 0 ? (
        <p className="text-center text-[var(--color-text-secondary)]">
          No active coupons right now.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 mt-16 md:grid-cols-3 lg:grid-cols-4">
          {coupons.map((coupon) => (
            <li
              key={coupon._id}
              className="p-6 bg-[var(--color-surface)] rounded-2xl shadow hover:shadow-lg transition border-l-4 border-[var(--color-primary)]"
            >
              <h4 className="mb-2 text-xl font-semibold text-[var(--color-primary)]">
                {coupon.code}
              </h4>
              <p className="text-[var(--color-text-primary)]">
                {coupon.discount}% off
              </p>
              {coupon.expiryDate && (
                <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                  Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Promotions;
