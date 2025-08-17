import React from "react";
import { useQuery } from "@tanstack/react-query";
import CouponBadge from "../../components/CouponBadge";
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

  return (
    <div
      className="px-4 mx-auto mt-2 py-14 md:px-10 max-w-7xl"
      // style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-11">
          <h2 className="text-4xl lg:text-5xl font-bold text-[var(--color-primary)] text-center mt-10">
            Promotions & Discounts
          </h2>
               <hr className="w-16 h-1 mx-auto mt-3 mb-4 bg-[var(--color-secondary)] rounded" />
        </div>
        {isLoading ? (
          <p className="text-gray-600">Loading coupons...</p>
        ) : coupons.length === 0 ? (
          <p className="text-gray-600">No active coupons right now.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {coupons.map((coupon) => (
              <CouponBadge
                key={coupon._id}
                code={coupon.code}
                discount={coupon.discount}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Promotions;
