import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import SocialLogin from './SocialLogin';
import Swal from 'sweetalert2'; // ✅ Import Swal

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { createUser, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location?.state?.from || '/';

  const [profilePic, setProfilePic] = useState('');
  const [uploading, setUploading] = useState(false);

  // ✅ Handle image upload to imgbb
  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('image', image);

    setUploading(true);
    try {
      const uploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
      const res = await axios.post(uploadUrl, formData);
      setProfilePic(res.data.data.url);

      Swal.fire({
        icon: 'success',
        title: 'Image Uploaded',
        text: 'Profile picture uploaded successfully!',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error('Image upload error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Could not upload image. Please try again.',
      });
    } finally {
      setUploading(false);
    }
  };

  // ✅ Submit handler
  const onSubmit = async (data) => {
    if (uploading) {
      Swal.fire({
        icon: 'info',
        title: 'Please wait',
        text: 'Image is still uploading...',
      });
      return;
    }

    try {
      const result = await createUser(data.email, data.password);
      if (!result?.user) return;

      await updateUserProfile({
        displayName: data.name,
        photoURL: profilePic,
      });

      const userInfo = {
        name: data.name,
        email: data.email,
        image: profilePic || "https://i.ibb.co/zfvpZf8/default-user.png",
        role: 'user',
        createdAt: new Date(),
      };

      await axiosSecure.post('/users', userInfo);

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'Welcome to the club!',
        timer: 2000,
        showConfirmButton: false,
      });

      navigate(from);
    } catch (error) {
      console.error('Registration error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.message || 'Something went wrong!',
      });
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto my-10 shadow-2xl card bg-base-100 shrink-0">
      <div className="card-body">
        <h1 className="mb-4 text-3xl font-bold text-center">Create Account</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <label className="label">Your Name</label>
          <input
            type="text"
            {...register('name', { required: true })}
            className="w-full input input-bordered"
            placeholder="Your Name"
          />
          {errors.name && <p className="text-sm text-red-500">Name is required</p>}

          {/* Profile Picture */}
          <label className="label">Profile Picture</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="w-full file-input file-input-bordered"
          />

          {/* Preview */}
          {profilePic && (
            <img
              src={profilePic}
              alt="Preview"
              className="w-20 h-20 mx-auto my-2 border rounded-full"
            />
          )}

          {/* Email */}
          <label className="label">Email</label>
          <input
            type="email"
            {...register('email', {
              required: true,
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            })}
            className="w-full input input-bordered"
            placeholder="Email"
          />
          {errors.email && <p className="text-sm text-red-500">Enter a valid email</p>}

          {/* Password */}
          <label className="label">Password</label>
          <input
            type="password"
            {...register('password', {
              required: true,
              minLength: 6,
              pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
            })}
            className="w-full input input-bordered"
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-sm text-red-500">
              Password must be 6+ characters and contain a number
            </p>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="w-full mt-4 btn btn-primary"
          >
            {uploading ? 'Uploading Image...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center">
          <small>
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500">Login</Link>
          </small>
        </p>

        <div className="divider">OR</div>
        <SocialLogin />
      </div>
    </div>
  );
};

export default Register;
