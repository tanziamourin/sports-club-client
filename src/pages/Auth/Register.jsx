import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import registerAnimation from "../../assets/Paper.json"; // replace with your .json
import SocialLogin from "./SocialLogin";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location?.state?.from || "/";

  const [profilePic, setProfilePic] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);
    setUploading(true);

    try {
      const uploadUrl = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_image_upload_key
      }`;
      const res = await axios.post(uploadUrl, formData);
      setProfilePic(res.data.data.url);
      Swal.fire({
        title: "✅ Uploaded",
        text: "Profile picture uploaded successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.log(err)
      Swal.fire({
        title: "Upload Failed",
        text: "Try again",
        icon: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (uploading) {
      Swal.fire({
        icon: "info",
        title: "Please wait",
        text: "Image is uploading...",
      });
      return;
    }

    try {
      const result = await createUser(data.email, data.password);

      console.log(result);
      await updateUserProfile({ displayName: data.name, photoURL: profilePic });

      const userInfo = {
        name: data.name,
        email: data.email.toLowerCase(),
        image: profilePic || "https://i.ibb.co/zfvpZf8/default-user.png",
        role: "user",
        createdAt: new Date(),
      };
      
console.log("👉 userInfo sending to backend:", userInfo);
await axiosSecure.post("/users", userInfo);

      Swal.fire({
        title: "🎉 Registered!",
        text: "Account created successfully!",
       
        imageWidth: 120,
        showConfirmButton: false,
        timer: 2500,
      });

      navigate(from);
    } catch (error) {
      console.log(error)
      // Swal.fire({
      //   title: "Error",
      //   text: error.message,
        
      //   imageWidth: 140,
      // });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 gap-10 md:flex-row bg-[var(--color-background)]">
      <div className="w-full max-w-md md:w-1/2">
        <Lottie animationData={registerAnimation} loop />
      </div>

      <div className="w-full max-w-sm p-6 bg-white shadow-2xl card dark:bg-gray-900 dark:text-white">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center text-[var(--color-primary)]">
            Create Account
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="Name"
              className="w-full input input-bordered"
            />
            {errors.name && (
              <p className="text-sm text-red-500">Name is required</p>
            )}

            <input
              type="file"
              onChange={handleImageUpload}
              className="w-full file-input file-input-bordered"
            />
            {profilePic && (
              <img
                src={profilePic}
                className="w-20 h-20 mx-auto my-2 rounded-full"
              />
            )}

            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Email"
              className="w-full input input-bordered"
            />
            {errors.email && (
              <p className="text-sm text-red-500">Enter a valid email</p>
            )}

            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              placeholder="Password"
              className="w-full input input-bordered"
            />
            {errors.password && (
              <p className="text-sm text-red-500">Minimum 6 characters</p>
            )}

            <button
              disabled={uploading}
              className="btn w-full bg-[var(--color-primary)] text-white hover:bg-orange-700"
            >
              {uploading ? "Uploading..." : "Register"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-[var(--color-text-primarys)]">
            Already have an account?
            <Link
              to="/login"
              className="ml-1 font-semibold text-[var(--color-primary)] hover:underline"
            >
              Login
            </Link>
          </p>

          <div className="divider text-[var(--color-text-primarys)]">OR</div>
          <SocialLogin />
        </div>
      </div>
    </div>
  );
};

export default Register;
