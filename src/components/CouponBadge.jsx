import React from 'react';

const CouponBadge = ({ code, discount }) => {
    return (
        <div className="p-4 m-2 rounded-lg shadow-lg badge-container bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <h3 className="text-lg font-bold text-white">{code}</h3>
            <p className="text-xl text-white">{discount}% OFF</p>
        </div>
    );
};

export default CouponBadge;