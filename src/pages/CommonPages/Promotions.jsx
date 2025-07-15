import React from 'react';
import { useQuery } from "@tanstack/react-query";
import CouponBadge from '../../components/CouponBadge';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const Promotions = () => {
  const axiosSecure = useAxiosSecure();

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/coupons");
      return res.data;
    }
  });

  return (
    <section
      className="px-4 mb-16 py-14 md:px-10"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <h2
          className="mb-16 text-3xl font-bold md:text-4xl"
          
        >
          🎁 Promotions & Discounts
        </h2>

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
    </section>
  );
};

export default Promotions;
