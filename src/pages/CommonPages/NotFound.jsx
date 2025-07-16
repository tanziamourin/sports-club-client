import React from "react";
import Lottie from "lottie-react";
import notFoundAnimation from "../../assets/Error 404.json"; // adjust the path if needed

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-[var(--color-background)] text-center">
      <div className="w-full max-w-md mb-6">
        <Lottie animationData={notFoundAnimation} loop autoplay />
      </div>
      <h2 className="text-4xl font-bold text-[var(--color-primary)] mb-2">
        Oops! Page Not Found
      </h2>
      <p className="text-[var(--color-text-secondary)] text-lg mb-6">
        The page you are looking for doesn’t exist or has been moved.
      </p>
      <a
        href="/"
        className="px-6 py-3 btn-primary rounded hover:bg-[var(--color-secondary)] transition"
      >
        Go to Homepage
      </a>
    </div>
  );
};

export default NotFound;
