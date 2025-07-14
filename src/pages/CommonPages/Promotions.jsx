import React from 'react';
import { useQuery } from "@tanstack/react-query";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
import CouponBadge from '../../components/CouponBadge';
import useAxiosSecure from '../../hooks/useAxiosSecure';
// import CouponBadge from './CouponBadge';

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
        <div className="py-10 bg-gray-100 promotions-section">
            <h2 className="mb-6 text-2xl font-semibold text-center">Promotions & Discounts</h2>
            <div className="flex flex-wrap justify-center coupons-container">
                {isLoading ? (
                    <p>Loading coupons...</p>
                ) : (
                    coupons.map((coupon) => (
                        <CouponBadge
                            key={coupon._id}
                            code={coupon.code}
                            discount={coupon.discount}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Promotions;
