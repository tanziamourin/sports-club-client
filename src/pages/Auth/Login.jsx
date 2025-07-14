import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import SocialLogin from './SocialLogin';
import toast from 'react-hot-toast'; // optional if using react-hot-toast

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';

  const onSubmit = (data) => {
    console.log("Form data:", data); // ✅ debug

    signIn(data.email, data.password)
      .then(result => {
        console.log("Login success:", result.user);
        toast.success('Login successful'); // optional
        navigate(from);
      })
      .catch(error => {
        console.error("Login error:", error);
        const errorCode = error.code;

        if (errorCode === "auth/user-not-found") {
          alert("No user found with this email");
          toast.error("No user found with this email");
        } else if (errorCode === "auth/wrong-password") {
          alert("Incorrect password");
          toast.error("Incorrect password");
        } else if (errorCode === "auth/invalid-email") {
          alert("Invalid email address");
          toast.error("Invalid email address");
        } else {
          alert("Login failed. Try again.");
          toast.error("Login failed. Try again.");
        }
      });
  };

  return (
    <div className="w-full max-w-sm shadow-2xl card bg-base-100 shrink-0">
      <div className="card-body">
        <h1 className="text-5xl font-bold">Please Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="label">Email</label>
          <input
            type="email"
            {...register('email', { required: true })}
            className="input"
            placeholder="Email"
          />
          {errors.email && <p className='text-red-500'>Enter a valid email</p>}

          <label className="label">Password</label>
          <input
            type="password"
            {...register('password', { required: true, minLength: 6 })}
            className="input"
            placeholder="Password"
          />
          {errors.password && <p className='text-red-500'>Password must be 6 characters or more</p>}

          <button className="mt-4 text-black btn btn-primary">Login</button>
        </form>

        <p><small>New to this website? <Link to="/register" className="btn btn-link">Register</Link></small></p>

        <div className="divider">OR</div>
        <SocialLogin />
      </div>
    </div>
  );
};

export default Login;
