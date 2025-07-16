import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ booking }) => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [finalPrice, setFinalPrice] = useState(booking.price);

  useEffect(() => {
    // ✅ Create PaymentIntent
    axiosSecure
      .post("/payments/create-payment-intent", { price: booking.price })
      .then((res) => setClientSecret(res.data.clientSecret));
  }, [booking.price, axiosSecure]);

  const handleCouponApply = async () => {
    if (!couponCode.trim()) {
      Swal.fire("Error", "Please enter a coupon code", "warning");
      return;
    }

    try {
      const res = await axiosSecure.get(`/coupons/apply/${couponCode}`);
      const coupon = res.data;
      const discount = booking.price * (coupon.discount / 100);
      const discountedPrice = booking.price - discount;
      setFinalPrice(discountedPrice.toFixed(2));
      Swal.fire("✅ Success!", `${coupon.discount}% discount applied!`, "success");
    } catch (err) {
      console.log(err)
      Swal.fire("❌ Invalid!", "Coupon not found or expired", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      Swal.fire("Error", error.message, "error");
      return;
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
        receipt_email: user?.email,
      });

    if (confirmError) {
      Swal.fire("Error", confirmError.message, "error");
      return;
    }

    if (paymentIntent.status === "succeeded") {
      const paymentData = {
        bookingId: booking._id,
        userEmail: user.email,
        price: finalPrice,
        date: new Date(),
        transactionId: paymentIntent.id,
        courtType: booking.courtType,
        slot: booking.slot,
        status: "confirmed",
      };

      await axiosSecure.post("/payments", paymentData);

      Swal.fire("✅ Payment Successful!", "Redirecting to your bookings...", "success").then(() => {
        navigate("/dashboard/member/confirmed");
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-4 mx-auto space-y-4 bg-white rounded shadow">
      <h2 className="text-4xl font-bold text-center text-[var(--color-primary)] mb-6">Payment Form</h2>

      {/* Coupon Apply */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter coupon"
          className="w-full input input-bordered"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <button type="button" className="btn btn-sm btn-info" onClick={handleCouponApply}>
          Apply
        </button>
      </div>

      {/* Read-only booking details */}
      <input className="w-full input input-bordered" value={user?.email} readOnly />
      <input className="w-full input input-bordered" value={booking.courtType} readOnly />
      <input className="w-full input input-bordered" value={Array.isArray(booking.slot) ? booking.slot.join(", ") : booking.slot} readOnly />
      <input className="w-full input input-bordered" value={booking.date} readOnly />
      <input className="w-full input input-bordered" value={`$${finalPrice}`} readOnly />

      {/* Stripe Card Input */}
      <CardElement className="p-2 border rounded" />

      {/* Pay Button */}
      <button type="submit" className="w-full mt-3 btn btn-primary" disabled={!stripe || !clientSecret}>
        Pay Now
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    axiosSecure.get(`/bookings/${id}`).then((res) => setBooking(res.data));
  }, [id, axiosSecure]);

  if (!booking) return <p className="p-6">Loading booking info...</p>;

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm booking={booking} />
    </Elements>
  );
};

export default PaymentPage;
