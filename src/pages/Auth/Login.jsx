import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import Swal from "sweetalert2";
import Lottie from "lottie-react";
import loginAnimation from "../../assets/login with account.json"; // replace with your .json path
import SocialLogin from "./SocialLogin";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then((result) => {
        Swal.fire({
          title: "🎉 Login Successful",
          text: `Welcome back, ${result.user.displayName || "User"}!`,
          imageUrl: "https://i.ibb.co/5cYwv9K/login.gif",
          imageWidth: 150,
          imageHeight: 150,
          showConfirmButton: false,
          timer: 2000,
        });
        navigate(from);
      })
      .catch((error) => {
        Swal.fire({
          title: "🚫 Login Failed",
          text: error.message,
          imageUrl: "https://i.ibb.co/2qj9rF9/error-cat.gif",
          imageWidth: 140,
          imageHeight: 140,
        });
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-10 px-4 py-10 md:flex-row bg-[var(--color-background)]">
      <div className="w-full max-w-md md:w-1/2">
        <Lottie animationData={loginAnimation} loop />
      </div>

      <div className="w-full max-w-sm p-6 bg-white shadow-2xl card dark:bg-gray-900 dark:text-white">
        <div className="card-body">
          <h1 className="text-4xl font-bold text-[var(--color-primary)]">
            Please Login
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="w-full input input-bordered"
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-red-500">Enter a valid email</p>
              )}
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                {...register("password", { required: true, minLength: 6 })}
                className="w-full input input-bordered"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500">Minimum 6 characters</p>
              )}
            </div>

            <button className="w-full mt-2 btn bg-[var(--color-primary)] text-white hover:bg-orange-700">
              Login
            </button>
          </form>

          <p className="mt-4 text-sm text-[var(--color-text-primarys)] text-center">
            New here?
            <Link
              to="/register"
              className="ml-1 font-semibold text-[var(--color-primary)] hover:underline"
            >
              Register
            </Link>
          </p>

          <div className="divider text-[var(--color-text-primarys)]">OR</div>
          <SocialLogin />
        </div>
      </div>
    </div>
  );
};

export default Login;
